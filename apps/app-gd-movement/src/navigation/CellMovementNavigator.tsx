import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CellMovementStackParamList } from './Root/types';
import { cellMovementListScreens, cellMovementScreens } from './Root/screens';

const Stack = createStackNavigator<CellMovementStackParamList>();

export const CellMovementNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CellMovementList" screenOptions={{ headerShown: true, title: 'Ячейки' }}>
      {Object.entries({ ...cellMovementListScreens, ...cellMovementScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof CellMovementStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
