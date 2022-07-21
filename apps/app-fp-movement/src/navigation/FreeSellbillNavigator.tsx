import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { FreeSellbillStackParamList } from './Root/types';
import { freeSellbillListScreens, freeSellbillScreens } from './Root/screens';

const Stack = createStackNavigator<FreeSellbillStackParamList>();

export const FreeSellbillNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="FreeSellbillList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...freeSellbillListScreens, ...freeSellbillScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof FreeSellbillStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
