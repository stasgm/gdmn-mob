import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CellsStackParamList } from './Root/types';
import { cellsListScreens, cellsScreens } from './Root/screens';

const Stack = createStackNavigator<CellsStackParamList>();

export const CellsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ContactList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...cellsListScreens, ...cellsScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof CellsStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
