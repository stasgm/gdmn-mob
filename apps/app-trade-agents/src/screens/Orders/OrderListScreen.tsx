import React, { useCallback, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { FilterButtons, ItemSeparator, Status } from '@lib/mobile-ui/src/components';
import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';

import { AddButton, BackButton, MenuButton } from '@lib/mobile-ui/src/components/AppBar';

import { useNavigation } from '@react-navigation/native';

import { useActionSheet } from '@lib/mobile-ui/src/hooks';

import styles from '@lib/mobile-ui/src/styles/global';

import { useTheme } from 'react-native-paper';

import { IOrderDocument } from '../../store/docs/types';

import { orderMock } from '../../store/docs/mock';

import OrderListItem from './components/OrderListItem';

const OrderListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('order') as unknown as IOrderDocument[];

  const [status, setStatus] = useState<Status>('all');

  const { colors } = useTheme();

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const filteredList = useMemo(() => {
    if (status === 'all') {
      return list;
    } else if (status === 'active') {
      return list.filter((e) => e.status !== 'PROCESSED');
    } else if (status === 'archive') {
      return list.filter((e) => e.status === 'PROCESSED');
    }
    return [];
  }, [status, list]);

  const renderItem = useCallback(
    ({ item }: { item: IOrderDocument }) => <OrderListItem key={item.id} item={item} />,
    [],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderView');
  }, [navigation]);

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(orderMock));
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteAllDocuments());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
      },
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddDocument, handleLoad, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <AddButton onPress={handleAddDocument} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    });
  }, [actionsMenu, handleAddDocument, navigation]);

  const ref = useRef<FlatList<IOrderDocument>>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </View>
  );
};

export default OrderListScreen;
