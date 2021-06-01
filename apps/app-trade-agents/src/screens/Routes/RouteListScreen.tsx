import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ItemSeparator, FilterButtons, Status } from '@lib/mobile-ui/src/components';
import { useDispatch, useSelector, documentActions, docSelectors } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/core';
import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';

import styles from '@lib/mobile-ui/src/styles/global';

import { useTheme } from 'react-native-paper';

import { useScrollToTop } from '@react-navigation/native';

import { routeMock } from '../../store/docs/mock';

import { IRouteDocument } from '../../store/docs/types';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('route') as IRouteDocument[];

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const { colors } = useTheme();

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
  useScrollToTop(ref);

  const renderItem = useCallback(
    ({ item }: { item: IRouteDocument }) => <RouteListItem key={item.id} item={item} />,
    [],
  );

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
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </View>
  );
};

export default RouteListScreen;
