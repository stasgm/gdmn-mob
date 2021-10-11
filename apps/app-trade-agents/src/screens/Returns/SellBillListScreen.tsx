import React, { useState, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  useActionSheet,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
} from '@lib/mobile-ui';

import { ISellBillDocument } from '../../store/types';
import { SellBillsStackParamList } from '../../navigation/Root/types';
import { getDateString } from '../../utils/helpers';

import { ReturnListRenderItemProps } from './components/ReturnListItem';
import ReturnSwipeListItem from './components/ReturnSwipeListItem';

const SellBillListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SellBillsStackParamList, 'SellBillList'>>();

  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType<ISellBillDocument>('bill');

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
  }, [status, list]);

  const renderItem:

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

export default SellBillListScreen;
