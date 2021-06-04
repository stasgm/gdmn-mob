import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OrderListScreen from '../../screens/Orders/OrderListScreen';
import OrderViewScreen from '../../screens/Orders/OrderViewScreen';
import OrderLineScreen from '../../screens/Orders/OrderLineScreen';

import SelectItemScreen from '../../screens/Orders/SelectItemScreen';

import { OrdersStackParamList } from './types';

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: 'Заявки' }} />
      <Stack.Screen name="OrderView" component={OrderViewScreen} options={{ title: 'Заявка' }} />
      <Stack.Screen name="OrderLine" component={OrderLineScreen} options={{ title: 'Позиция заявки' }} />
      <Stack.Screen name="SelectItem" component={SelectItemScreen} options={{ title: 'Заявка' }} />
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
