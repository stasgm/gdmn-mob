import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { GoodSalesStackParamList } from './types';
import { goodSalesScreens, goodSalesListScreens } from './screens';

const Stack = createStackNavigator();

const GoodSalesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ContactList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...goodSalesListScreens, ...goodSalesScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof GoodSalesStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
export default GoodSalesNavigator;
