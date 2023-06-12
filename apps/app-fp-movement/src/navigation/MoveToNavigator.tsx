import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MoveToStackParamList } from './Root/types';
import { moveToListScreens, moveToScreens } from './Root/screens';

const Stack = createStackNavigator<MoveToStackParamList>();

export const MoveToNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MoveToList" screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      {Object.entries({ ...moveToListScreens, ...moveToScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof MoveToStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
