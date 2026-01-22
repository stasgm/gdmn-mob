import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PalletStackParamList } from './Root/types';
import { palletListScreens, palletScreens } from './Root/screens';

const Stack = createStackNavigator<PalletStackParamList>();

export const PalletNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PalletList" screenOptions={{ headerShown: true, title: 'Палеты' }}>
      {Object.entries({ ...palletListScreens, ...palletScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof PalletStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
