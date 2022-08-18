import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { INamedEntity } from '@lib/types';
import {
  AppActivityIndicator,
  AppDialog,
  AppScreen,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  LargeText,
  MediumText,
  PrimeButton,
} from '@lib/mobile-ui';

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { IApplDocument, IApplLine } from '../../store/types';

import { ApplsStackParamList } from '../../navigation/Root/types';

import ApplItem from './components/ApplItem';
import { navBackButton } from './components/navigateOptions';

const ApplViewScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplView'>>();
  const { id } = useRoute<RouteProp<ApplsStackParamList, 'ApplView'>>().params;

  const [visibleDialog, setVisibleDialog] = React.useState(false);
  const [refuseReason, setRefuseReason] = React.useState('');

  const appl = docSelectors.selectByDocId<IApplDocument>(id);
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
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }
  if (!appl) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IApplLine }) => <ApplItem item={item} />;

  return (
    <AppScreen>
      <InfoBlock colorLabel={colors.primary} title={appl.head.headCompany.name}>
        <>
          <LargeText style={[styles.textBold, styles.textDescription]}>{appl.head.dept.name}</LargeText>
          <MediumText>{`№ ${appl.number} от ${getDateString(appl.documentDate)}`} </MediumText>
          <MediumText>{`${appl.head.purpose.name}`} </MediumText>
          <MediumText style={[styles.field, styles.number]}>{`${appl.head.justification}`} </MediumText>
          {appl.head.applStatus.name ? (
            <Text style={[styles.textBold, styles.field]}>{appl.head.applStatus.name}</Text>
          ) : null}
          {appl.head.cancelReason ? (
            <Text style={[styles.field, styles.number]}>{`${appl.head.cancelReason}`} </Text>
          ) : null}
          <ItemSeparator />

          <LargeText style={styles.textBold}>{appl.head.sysApplicant?.name || ' - '} </LargeText>
          <MediumText>Системный заявитель</MediumText>

          <Divider />

          <LargeText style={styles.textBold}>{appl.head.applicant?.name || ' - '} </LargeText>
          <MediumText>Заявитель</MediumText>

          <Divider />

          <LargeText style={styles.textBold}>{appl.head.specPreAgree?.name || ' - '} </LargeText>
          <MediumText>Специалист, предварительно согласовавший заявку</MediumText>

          <Divider />

          <LargeText style={styles.textBold}>{appl.head.specAgreeEngin?.name || ' - '} </LargeText>
          <MediumText>Специалист, согласовавший со стороны инженерной службы заявку</MediumText>
        </>
      </InfoBlock>
      <FlatList
        data={appl.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
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
      <AppDialog
        title="Укажите причину отказа"
        visible={visibleDialog}
        text={refuseReason}
        onChangeText={setRefuseReason}
        onCancel={() => setVisibleDialog(false)}
        onOk={handleRefuse}
        okLabel={'Сохранить'}
      />
    </AppScreen>
  );
};

export default ApplViewScreen;
