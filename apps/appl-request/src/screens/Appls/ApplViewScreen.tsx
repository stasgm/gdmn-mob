import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
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

import { Divider, useTheme } from 'react-native-paper';

import { IApplDocument, IApplLine } from '../../store/types';

import { getDateString } from '../../utils/helpers';

import { ApplsStackParamList } from '../../navigation/Root/types';

import ApplItem from './components/ApplItem';

const ApplViewScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplView'>>();
  const { id } = useRoute<RouteProp<ApplsStackParamList, 'ApplView'>>().params;

  const appl = docSelectors.selectByDocType<IApplDocument>('Заявки на закупку ТМЦ').find((e) => e.id === id);

  const refApplStatuses = refSelectors.selectByName<INamedEntity>('Statuses').data;

  const isBlocked = !['DRAFT', 'READY'].includes(appl?.status || 'DRAFT'); // Заменить на реальные данные

  const handleRefuse = useCallback(() => {
    if (!id || !appl) {
      return;
    }

    const newDocument: IApplDocument = {
      ...appl,
      status: 'READY',
      head: { ...appl.head, applStatus: refApplStatuses[2] },
    };

    dispatch(documentActions.updateDocument({ docId: id, document: newDocument }));

    navigation.goBack();
  }, [appl, dispatch, id, navigation, refApplStatuses]);

  const handleAccept = useCallback(() => {
    if (!id || !appl) {
      return;
    }

    const newDocument: IApplDocument = {
      ...appl,
      status: 'READY',
      head: { ...appl.head, applStatus: refApplStatuses[1] },
    };

    dispatch(documentActions.updateDocument({ docId: id, document: newDocument }));

    navigation.goBack();
  }, [appl, dispatch, id, navigation, refApplStatuses]);

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
      <InfoBlock colorLabel={colors.primary} title={appl.head.dept.name}>
        <>
          <Text>{`№ ${appl.number} от ${getDateString(appl.documentDate)}`} </Text>
          <Text>{`${appl.head.purpose.name}`} </Text>
          <Text style={[styles.field, styles.number]}>{`${appl.head.justification}`} </Text>
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
          <PrimeButton icon="delete" style={styles.flexGrow} onPress={handleRefuse} type={'cancel'}>
            Отклонить
          </PrimeButton>
        </View>
      ) : null}
    </AppScreen>
  );
};

export default ApplViewScreen;
