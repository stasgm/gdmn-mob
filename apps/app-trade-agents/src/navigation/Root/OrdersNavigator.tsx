import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OrdersStackParamList } from './types';
import { orderListScreens, orderScreens } from './screens';

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...orderListScreens, ...orderScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof OrdersStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
