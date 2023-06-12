import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MoveFromStackParamList } from './Root/types';
import { moveFromListScreens, moveFromScreens } from './Root/screens';

const Stack = createStackNavigator<MoveFromStackParamList>();

export const MoveFromNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MoveFromList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...moveFromListScreens, ...moveFromScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof MoveFromStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
