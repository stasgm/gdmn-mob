// import { SubTitle } from '@lib/mobile-ui/src/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { OrdersStackParamList } from '../../navigation/Root/types';

const OrderViewScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? 'Просмотр заявки' : 'Создание заявки'}</Text>
    </View>
  );
};

export default OrderViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
