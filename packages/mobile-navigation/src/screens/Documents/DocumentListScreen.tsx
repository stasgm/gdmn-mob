import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

import { IDocument } from '@lib/types';
import { useDispatch, useSelector, documentActions } from '@lib/store';
import { useNavigation } from '@react-navigation/core';
import { documentsMock } from '@lib/mock';
import {
  MenuButton,
  DrawerButton,
  AppScreen,
  useActionSheet,
  globalStyles as styles,
  ItemSeparator,
} from '@lib/mobile-ui';
/*
import { useRoute, RouteProp } from '@react-navigation/native';

import { DocumentsTabsStackParamsList } from '../../navigation/Root/types'; */

// import { styles } from './styles';
import DocumentItem from './components/DocumentItem';

const DocumentListScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);

  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLoad = () => {
    dispatch(documentActions.addDocuments(documentsMock));
  };

  const handleReset = () => {
    dispatch(documentActions.init());
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Удалить все документы',
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
  }, [navigation]);

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
    <AppScreen style={styles.contentTop}>
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
    </AppScreen>
  );
};

export default DocumentListScreen;
