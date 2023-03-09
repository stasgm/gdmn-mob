import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReturnStackParamList } from './Root/types';
import { returnListScreens, returnScreens } from './Root/screens';

const Stack = createStackNavigator<ReturnStackParamList>();

export const ReturnNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      {Object.entries({ ...returnListScreens, ...returnScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof ReturnStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
