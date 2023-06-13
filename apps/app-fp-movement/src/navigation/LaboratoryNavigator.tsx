import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LaboratoryStackParamList } from './Root/types';
import { laboratoryListScreens, laboratoryScreens } from './Root/screens';

const Stack = createStackNavigator<LaboratoryStackParamList>();

export const LaboratoryNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LaboratoryList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...laboratoryListScreens, ...laboratoryScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof LaboratoryStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
