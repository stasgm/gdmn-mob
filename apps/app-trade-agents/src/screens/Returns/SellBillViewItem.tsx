import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import {
  AddButton,
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
} from '@lib/mobile-ui';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ISellBillDocument, ISellBillLine } from '../../store/types';

import { getDateString } from '../../utils/helpers';

import { SellBillsStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SellBillItem from './SellBillItem';

const SellBillViewItem = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<SellBillsStackParamList, 'SellBillViewItem'>>();
  const { id } = useRoute<RouteProp<SellBillsStackParamList, 'SellBillViewItem'>>().params;

  const billDoc = docSelectors.selectByDocType<ISellBillDocument>('bill')?.find((e) => e.id === id);

  const isBlocked = billDoc?.status !== 'DRAFT';

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.removeDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар',
      },
      {
        title: 'Редактировать данные',
      },
      {
        title: 'Удалить накладную',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <MenuButton actionsMenu={actionsMenu} />
          </View>
        ),
    });
  }, [navigation, actionsMenu, isBlocked]);

  if (!billDoc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ISellBillLine }) => (
    <SellBillItem docId={billDoc.id} item={item} readonly={isBlocked} />
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(billDoc?.status || 'DRAFT')}
        title={billDoc?.head.outlet.name}
        // onPress={}
        disabled={isBlocked}
      >
        <View style={styles.directionRow}>
          <Text>{`№ ${billDoc.number} от ${getDateString(billDoc.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={billDoc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default SellBillViewItem;
