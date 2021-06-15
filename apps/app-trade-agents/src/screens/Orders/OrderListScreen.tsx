import React, { useCallback, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  useActionSheet,
  AddButton,
  DrawerButton,
  MenuButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
} from '@lib/mobile-ui';

import { IOrderDocument } from '../../store/docs/types';

import OrderListItem from './components/OrderListItem';

const OrderListScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('order') as IOrderDocument[];

  const [status, setStatus] = useState<Status>('all');

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
    // const newOrder = {
    //   id: '9',
    //   number: '225',
    //   documentDate: '2021.06.03',
    //   documentType: orderType,
    //   status: 'DRAFT',
    //   head: {
    //     contact: contact1,
    //     outlet: outlet1,
    //     ondate: '02.06.2021',
    //   },
    // };
    // dispatch(documentActions.addDocument());
    navigation.navigate('OrderEdit');
  }, [navigation]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteDocuments());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
      },
      /*       {
              title: 'Удалить',
              type: 'destructive',
              onPress: handleDelete,
            }, */
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddDocument]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddDocument} />
        </View>
      ),
    });
  }, [actionsMenu, handleAddDocument, navigation]);

  const ref = useRef<FlatList<IOrderDocument>>(null);

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
