import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import {
  ItemSeparator,
  FilterButtons,
  Status,
  globalStyles as styles,
  DrawerButton,
  useActionSheet,
  MenuButton,
} from '@lib/mobile-ui';
import { useSelector, docSelectors, useDispatch, documentActions } from '@lib/store';

import { IRouteDocument } from '../../store/docs/types';

import { routeMock } from '../../store/docs/mock';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<Status>('active');

  const { loading } = useSelector((state) => state.documents);

  const list = (docSelectors.selectByDocType('route') as IRouteDocument[]).sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
  );

  const ref = useRef<FlatList<IRouteDocument>>(null);
  useScrollToTop(ref);

  const filteredList = useMemo(() => {
    if (status === 'all') {
      return list;
    } else if (status === 'active') {
      return list.filter((e) => new Date(e.documentDate).getTime() > new Date().setDate(new Date().getDate() - 1));
    } else if (status === 'archive') {
      return list.filter((e) => new Date(e.documentDate).getTime() <= new Date().setDate(new Date().getDate() - 1));
    }
    return [];
  }, [status, list]);

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderView');
  }, [navigation]);

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(routeMock));
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
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  const renderItem = ({ item }: { item: IRouteDocument }) => <RouteListItem key={item.id} item={item} />;

  return (
    <View style={styles.container}>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </View>
  );
};

export default RouteListScreen;
