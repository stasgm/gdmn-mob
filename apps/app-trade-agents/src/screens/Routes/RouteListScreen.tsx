import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

import { ItemSeparator, FilterButtons, Status } from '@lib/mobile-ui/src/components';
import { useDispatch, useSelector, documentActions, docSelectors } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/core';
import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';

import { routeMock } from '../../store/docs/mock';

import { IRouteDocument } from '../../store/docs/types';

import { styles } from './styles';
import DocumentItem from './components/DocumentItem';

const RouteListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('route') as unknown as IRouteDocument[];

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<Status>('all');

  const renderItem = useCallback(
    ({ item }: { item: IRouteDocument }) => <DocumentItem key={item.id} item={item} />,
    [],
  );

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

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(routeMock));
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteAllDocuments());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
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
  }, [handleLoad, handleDelete, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  const ref = useRef<FlatList<IRouteDocument>>(null);

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

export default RouteListScreen;
