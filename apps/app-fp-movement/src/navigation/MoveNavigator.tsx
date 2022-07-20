import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MoveStackParamList } from './Root/types';
import { moveListScreens, moveScreens } from './Root/screens';

const Stack = createStackNavigator<MoveStackParamList>();

export const MoveNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MoveList" screenOptions={{ headerShown: true, title: 'Перемещение' }}>
      {Object.entries({ ...moveListScreens, ...moveScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof MoveStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
