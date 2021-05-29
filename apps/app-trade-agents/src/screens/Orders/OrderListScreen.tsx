import React, { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ItemSeparator, SubTitle } from '@lib/mobile-ui/src/components';
import { IDocument } from '@lib/types';
import { useSelector } from '@lib/store';

import { RouteProp, useRoute } from '@react-navigation/native';

import { OrdersTabStackParamList } from '../../navigation/Root/types';

import DocumentItem from './components/DocumentItem';

import { styles } from './styles';

const OrderListScreen = () => {
  const route = useRoute<RouteProp<OrdersTabStackParamList, 'OrderList' | 'OrderArchList'>>();
  const { list, loading } = useSelector((state) => state.documents);

  const [filtredList, setFiltredList] = useState<IDocument[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (route?.name === 'OrderList') {
      setFiltredList(list.filter((i) => i.status !== 'PROCESSED'));
      return;
    }
    if (route?.name === 'OrderArchList') {
      setFiltredList(list.filter((i) => i.status === 'PROCESSED'));
      return;
    }
  }, [list, route?.name]);

  useEffect(() => {
    setTitle(route?.name === 'OrderList' ? 'Новые' : route?.name === 'OrderArchList' ? 'Архив' : '');
  }, [route?.name]);

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
      <View>
        <SubTitle>{title}</SubTitle>
      </View>
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
