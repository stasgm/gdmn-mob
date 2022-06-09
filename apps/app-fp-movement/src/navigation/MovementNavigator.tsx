import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MovementStackParamList } from './Root/types';
import { movementListScreens, movementScreens } from './Root/screens';

const Stack = createStackNavigator<MovementStackParamList>();

export const MovementNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MovementList" screenOptions={{ headerShown: true, title: 'Перемещение' }}>
      {Object.entries({ ...movementListScreens, ...movementScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof MovementStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
