import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { GoodMatrixStackParamList } from './types';
import { goodMatrixScreens, goodMatrixListScreens } from './screens';

const Stack = createStackNavigator();

const GoodMatrixNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ContactList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...goodMatrixListScreens, ...goodMatrixScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof GoodMatrixStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
export default GoodMatrixNavigator;
