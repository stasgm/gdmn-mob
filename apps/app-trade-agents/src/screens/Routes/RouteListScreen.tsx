import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { IDocument } from '@lib/types';
import { useDispatch, useSelector, documentActions, docSelectors } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/core';
import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';

import { routeMock } from '../../store/docs/mock';

import { styles } from './styles';
import DocumentItem from './components/DocumentItem';

const RouteListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('route');

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(routeMock));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(documentActions.init());
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
        onPress: handleReset,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleLoad, handleReset, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  const renderItem = ({ item }: { item: IDocument }) => (
    <DocumentItem
      key={item.id}
      item={item}
      fields={{
        number: { name: 'number', type: 'string' },
        typeDoc: { name: 'documentType', type: 'INamedEntity' },
        important: { name: 'status', type: 'string' },
        addition1: { name: 'documentDate', type: 'string' },
      }}
    />
  );

  const ref = useRef<FlatList<IDocument>>(null);

  return (
    <>
      <FlatList
        ref={ref}
        data={list}
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
