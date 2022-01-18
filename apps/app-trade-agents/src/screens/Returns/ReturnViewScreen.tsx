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

import { IReturnDocument, IReturnLine } from '../../store/types';

import { getDateString } from '../../utils/helpers';

import { ReturnsStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SwipeLineItem from '../../components/SwipeLineItem';

import ReturnItem from './components/ReturnItem';

const ReturnViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();
  const { id } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params;

  const returnDoc = docSelectors.selectByDocType<IReturnDocument>('return')?.find((e) => e.id === id);

  const isBlocked = returnDoc?.status !== 'DRAFT';

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.removeDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  const handleEditReturnHead = useCallback(() => {
    navigation.navigate('ReturnEdit', { id });
  }, [navigation, id]);

  const handleAddSellBill = useCallback(() => {
    navigation.navigate('SellBill', { id });
  }, [navigation, id]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар из накладной',
        onPress: handleAddSellBill,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditReturnHead,
      },
      {
        title: 'Удалить возврат',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddSellBill, handleEditReturnHead, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <MenuButton actionsMenu={actionsMenu} />
            <AddButton onPress={handleAddSellBill} />
          </View>
        ),
    });
  }, [navigation, actionsMenu, isBlocked, handleAddSellBill]);

  if (!returnDoc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IReturnLine }) => (
    <SwipeLineItem docId={returnDoc.id} item={item} readonly={isBlocked} copy={false} routeName="ReturnLine">
      <ReturnItem docId={returnDoc.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(returnDoc?.status || 'DRAFT')}
        title={returnDoc?.head.outlet.name}
        onPress={handleEditReturnHead}
        disabled={isBlocked}
      >
        <View style={styles.directionRow}>
          <Text>{`№ ${returnDoc.number} от ${getDateString(returnDoc.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={returnDoc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReturnViewScreen;
