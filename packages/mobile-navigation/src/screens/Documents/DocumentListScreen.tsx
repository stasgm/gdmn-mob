import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { IDocument } from '@lib/types';
import { useDispatch, useSelector, documentActions } from '@lib/store';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/core';
import DrawerButton from '@lib/mobile-ui/src/components/AppBar/DrawerButton';
import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';

import { documentsMock } from '@lib/mock';

import { styles } from './styles';
import DocumentItem from './components/DocumentItem';

const DocumentListScreen = () => {
  const { list, loading } = useSelector((state) => state.documents);
  // const { colors } = useTheme();

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

export default DocumentListScreen;
