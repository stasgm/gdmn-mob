import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SellbillStackParamList } from './Root/types';
import { sellbillListScreens, sellbillScreens } from './Root/screens';

const Stack = createStackNavigator<SellbillStackParamList>();

export const SellbillNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SellbillList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...sellbillListScreens, ...sellbillScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof SellbillStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
