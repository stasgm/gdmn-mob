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

import { NestingOrderParamList, OrdersStackParamList } from './types';

const Stack = createStackNavigator<OrdersStackParamList>();

const orderScreens = [
  {
    name: 'OrderView',
    component: OrderViewScreen,
  },
  {
    name: 'OrderEdit',
    component: OrderEditScreen,
  },
  {
    name: 'OrderLine',
    component: OrderLineScreen,
  },
  {
    name: 'SelectGroupItem',
    component: SelectGroupScreen,
  },
  {
    name: 'SelectGoodItem',
    component: SelectGoodScreen,
  },
  {
    name: 'SelectRefItem',
    component: SelectRefItemScreen,
  },
];

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      {orderScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof NestingOrderParamList}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
