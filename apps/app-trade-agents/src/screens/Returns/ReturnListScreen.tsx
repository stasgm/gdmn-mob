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

import { IReturnDocument } from '../../store/docs/types';

import ReturnListItem from './components/ReturnListItem';

const ReturnListScreen = () => {
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('return') as unknown as IReturnDocument[];

  const [status, setStatus] = useState<Status>('all');

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
    ({ item }: { item: IReturnDocument }) => <ReturnListItem key={item.id} item={item} />,
    [],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('ReturnEdit');
  }, [navigation]);

  const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteDocuments());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
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
  }, [showActionSheet, handleAddDocument, handleDelete]);

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

  const ref = useRef<FlatList<IReturnDocument>>(null);

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

export default ReturnListScreen;
