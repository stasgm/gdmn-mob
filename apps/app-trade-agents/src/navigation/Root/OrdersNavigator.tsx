import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  OrderLineScreen,
  OrderListScreen,
  OrderEditScreen,
  OrderViewScreen,
  SelectGroupScreen,
  SelectGoodScreen,
} from '../../screens/Orders';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { OrdersStackParamList } from './types';

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderView" component={OrderViewScreen} />
      <Stack.Screen name="OrderEdit" component={OrderEditScreen} />
      <Stack.Screen name="OrderLine" component={OrderLineScreen} />
      <Stack.Screen name="SelectGroupItem" component={SelectGroupScreen} />
      <Stack.Screen name="SelectGoodItem" component={SelectGoodScreen} />
      <Stack.Screen name="SelectRefItem" component={SelectRefItemScreen} />
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
