import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OrderLineScreen, OrderListScreen, OrderViewScreen, SelectItemScreen } from '../../screens/Orders';

import { OrdersStackParamList } from './types';

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderView" component={OrderViewScreen} />
      <Stack.Screen name="OrderLine" component={OrderLineScreen} />
      <Stack.Screen name="SelectItem" component={SelectItemScreen} />
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
