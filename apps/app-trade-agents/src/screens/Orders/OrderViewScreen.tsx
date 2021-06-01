// import { SubTitle } from '@lib/mobile-ui/src/components';
import { ItemSeparator, SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors } from '@lib/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';

import styles from '@lib/mobile-ui/src/styles/global';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import OrderItem from './components/OrderItem';
import Header from './components/Header';

const OrderViewScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;
  const list = (docSelectors.selectByDocType('order') as IOrderDocument[])?.find((e) => e.id === id);

  if (!list) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Заказ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IOrderLine }) => <OrderItem item={item} />;

  return (
    <View style={[styles.container]}>
      {/* <SubTitle style={styles.title}>{list.documentDate}</SubTitle> */}
      <Header item={list} />
      <Divider />
      <FlatList
        // ref={ref}
        data={list.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default OrderViewScreen;
