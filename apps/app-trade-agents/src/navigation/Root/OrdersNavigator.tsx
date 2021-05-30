import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { OrdersStackParamList } from './types';
import OrdersTabsNavigator from './OrdersTabsNavigator';

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Tabs" component={OrdersTabsNavigator} options={{ title: 'Заявки' }} />
    </Stack.Navigator>
  );
};

export default OrdersNavigator;
