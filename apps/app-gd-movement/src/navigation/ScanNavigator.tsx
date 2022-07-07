import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ScanStackParamList } from './Root/types';
import { scanListScreens, scanScreens } from './Root/screens';

const Stack = createStackNavigator<ScanStackParamList>();

export const ScanNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ScanList" screenOptions={{ headerShown: true, title: 'Сканирование' }}>
      {Object.entries({ ...scanListScreens, ...scanScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof ScanStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
