import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, useSelector } from '@lib/store';
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

import { IReturnDocument } from '../../store/types';
import { ReturnsStackParamList } from '../../navigation/Root/types';
import { getDateString } from '../../utils/helpers';

import { IReturnListRenderItemProps } from './components/ReturnListItem';
import ReturnSwipeListItem from './components/ReturnSwipeListItem';

const ReturnListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnList'>>();
  const showActionSheet = useActionSheet();

  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType<IReturnDocument>('return');

  const [status, setStatus] = useState<Status>('all');

  const filteredList = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list.filter((e) => e.status === 'PROCESSED')
        : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.outlet?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IReturnListRenderItemProps),
    );
  }, [status, list]);

  const renderItem: ListRenderItem<IReturnListRenderItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? <ReturnSwipeListItem renderItem={item} item={doc} /> : null;
  };

  const handleAddDocument = useCallback(() => {
    navigation.navigate('ReturnEdit');
  }, [navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
      },
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

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
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
