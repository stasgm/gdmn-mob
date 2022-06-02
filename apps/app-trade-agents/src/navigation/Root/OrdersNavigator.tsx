import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { orderListScreens, orderScreens } from './screens';

const Stack = createStackNavigator();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...orderListScreens, ...orderScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default OrdersNavigator;
