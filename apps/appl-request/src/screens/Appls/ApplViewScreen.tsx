import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, useTheme, Dialog, Button, TextInput } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { INamedEntity } from '@lib/types';
import {
  AppScreen,
  BackButton,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  PrimeButton,
  SubTitle,
} from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IApplDocument, IApplLine } from '../../store/types';

import { ApplsStackParamList } from '../../navigation/Root/types';

import ApplItem from './components/ApplItem';

const ApplViewScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplView'>>();
  const { id } = useRoute<RouteProp<ApplsStackParamList, 'ApplView'>>().params;

  const [visibleDialog, setVisibleDialog] = React.useState(false);
  const [refuseReason, setRefuseReason] = React.useState('');

  const appl = docSelectors.selectByDocType<IApplDocument>('request').find((e) => e.id === id);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setRefuseReason(appl?.head.cancelReason || '');
  }, [appl?.head.cancelReason]);

  //TODO Если справочник статусов не загружен, будет ошибка!!!
  const refApplStatuses = refSelectors.selectByName<INamedEntity>('Statuses')?.data;

  const isBlocked = !['DRAFT', 'READY'].includes(appl?.status || 'DRAFT'); // Заблокировано если статус не Черновик или не Готово

  const statusAccepted = refApplStatuses.find((i) => i.name === 'Утвержден')!;
  const statusRefused = refApplStatuses.find((i) => i.name === 'Отказано')!;

  const handleRefuse = useCallback(() => {
    if (!id || !appl) {
      return;
    }

    const date = new Date().toISOString();

    const updatedDocument: IApplDocument = {
      ...appl,
      status: 'READY',
      errorMessage: undefined,
      head: {
        ...appl.head,
        applStatus: statusRefused,
        cancelReason: refuseReason,
        specCancel: user && { id: user.id, name: user.name },
      },
      creationDate: appl.creationDate || date,
      editionDate: date,
    };

    dispatch(documentActions.updateDocument({ docId: id, document: updatedDocument }));

    navigation.goBack();
  }, [appl, dispatch, id, navigation, refuseReason, statusRefused, user]);

  const handleAccept = useCallback(() => {
    if (!id || !appl) {
      return;
    }

    const date = new Date().toISOString();

    const updatedDocument: IApplDocument = {
      ...appl,
      status: 'READY',
      errorMessage: undefined,
      head: {
        ...appl.head,
        applStatus: statusAccepted,
        cancelReason: '',
        specApprove: user && { id: user.id, name: user.name },
      },
      creationDate: appl.creationDate || date,
      editionDate: date,
    };

    dispatch(documentActions.updateDocument({ docId: id, document: updatedDocument }));

    navigation.goBack();
  }, [appl, dispatch, id, navigation, statusAccepted, user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  if (!appl) {
    return (
      <AppScreen>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </AppScreen>
    );
  }

  const renderItem = ({ item }: { item: IApplLine }) => <ApplItem docId={appl.id} item={item} />;

  return (
    <AppScreen>
      <InfoBlock colorLabel={colors.primary} title={appl.head.headCompany.name}>
        <>
          <Text style={[styles.textBold, styles.textDescription]}>{appl.head.dept.name}</Text>
          <Text>{`№ ${appl.number} от ${getDateString(appl.documentDate)}`} </Text>
          <Text>{`${appl.head.purpose.name}`} </Text>
          <Text style={[styles.field, styles.number]}>{`${appl.head.justification}`} </Text>
          {appl.head.applStatus.name ? (
            <Text style={[styles.textBold, styles.field]}>{appl.head.applStatus.name}</Text>
          ) : null}
          {appl.head.cancelReason ? (
            <Text style={[styles.field, styles.number]}>{`${appl.head.cancelReason}`} </Text>
          ) : null}
          <ItemSeparator />
          <Text style={[styles.name]}>{appl.head.sysApplicant?.name || ' - '} </Text>
          <Text style={[styles.field, styles.number]}>Системный заявитель</Text>
          <Divider />
          <Text style={[styles.name]}>{appl.head.applicant?.name || ' - '} </Text>
          <Text style={[styles.field, styles.number]}>Заявитель</Text>
          <Divider />
          <Text style={[styles.name]}>{appl.head.specPreAgree?.name || ' - '} </Text>
          <Text style={[styles.field, styles.number]}>Специалист предварительно согласовавший заявку</Text>
          <Divider />
          <Text style={[styles.name]}>{appl.head.specAgreeEngin?.name || ' - '} </Text>
          <Text style={[styles.field, styles.number]}>
            Специалист согласовавший со стороны инженерной службы заявку
          </Text>
        </>
      </InfoBlock>
      <FlatList
        data={appl.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      {!isBlocked ? (
        <View style={styles.flexDirectionRow}>
          <PrimeButton icon="check-circle" style={styles.flexGrow} onPress={handleAccept}>
            Разрешить
          </PrimeButton>
          <PrimeButton icon="delete" style={styles.flexGrow} onPress={() => setVisibleDialog(true)} type={'cancel'}>
            Отклонить
          </PrimeButton>
        </View>
      ) : null}
      <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
        <Dialog.Title>Укажите причину отказа</Dialog.Title>
        <Dialog.Content>
          <TextInput value={refuseReason} onChangeText={setRefuseReason} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisibleDialog(false)}>Отмена</Button>
          <Button onPress={handleRefuse}>Сохранить</Button>
        </Dialog.Actions>
      </Dialog>
    </AppScreen>
  );
};

export default ApplViewScreen;
