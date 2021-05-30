import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

import { ItemSeparator } from '@lib/mobile-ui/src/components';
import { RouteProp, useRoute } from '@react-navigation/native';

import { docSelectors, useSelector } from '@lib/store';

import { OrdersTabStackParamList } from '../../navigation/Root/types';

import { IOrderDocument } from '../../store/docs/types';

import DocumentItem from './components/DocumentItem';
import { styles } from './styles';

const OrderListScreen = () => {
  const route = useRoute<RouteProp<OrdersTabStackParamList, 'OrderList' | 'OrderArchList'>>();
  const { loading } = useSelector((state) => state.documents);
  const list = docSelectors.selectByDocType('order') as unknown as IOrderDocument[];

  const filtredList = useMemo(() => {
    if (route?.name === 'OrderList') {
      return list.filter((i) => i.status !== 'PROCESSED');
    }

    if (route?.name === 'OrderArchList') {
      return list.filter((i) => i.status === 'PROCESSED');
    }

    return [];
  }, [list, route?.name]);

  const renderItem = useCallback(
    ({ item }: { item: IOrderDocument }) => <DocumentItem key={item.id} item={item} />,
    [],
  );

  const ref = useRef<FlatList<IOrderDocument>>(null);

  return (
    <>
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

export default OrderListScreen;
