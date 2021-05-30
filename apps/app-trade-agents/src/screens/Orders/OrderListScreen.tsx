import React, { useCallback, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { FilterButtons, ItemSeparator, Status } from '@lib/mobile-ui/src/components';
import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';

import { AddButton, DrawerButton, MenuButton } from '@lib/mobile-ui/src/components/AppBar';

import { useNavigation } from '@react-navigation/native';

import { useActionSheet } from '@lib/mobile-ui/src/hooks';

import { IOrderDocument } from '../../store/docs/types';

import { orderMock } from '../../store/docs/mock';

import DocumentItem from './components/DocumentItem';
import { styles } from './styles';

const OrderListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('order') as unknown as IOrderDocument[];

  const [status, setStatus] = useState<Status>('all');

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const filtredList = useMemo(() => {
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
    ({ item }: { item: IOrderDocument }) => <DocumentItem key={item.id} item={item} />,
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
      headerLeft: () => <DrawerButton />,
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
    <>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filtredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </>
  );
};

export default OrderListScreen;
