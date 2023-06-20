import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PrihodStackParamList } from './Root/types';
import { prihodListScreens, prihodScreens } from './Root/screens';

const Stack = createStackNavigator<PrihodStackParamList>();

export const PrihodNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PrihodList" screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      {Object.entries({ ...prihodListScreens, ...prihodScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof PrihodStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
