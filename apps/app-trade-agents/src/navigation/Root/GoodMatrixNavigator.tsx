import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { GoodMatrixStackParamList } from './types';
import { returnListScreens, returnScreens, goodMatrixScreens, goodMatrixListScreens } from './screens';

const Stack = createStackNavigator<GoodMatrixStackParamList>();

const GoodMatrixNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ContactList" screenOptions={{ headerShown: true, title: 'Матрицы' }}>
      {Object.entries({ ...goodMatrixListScreens, ...goodMatrixScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof GoodMatrixStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};
export default GoodMatrixNavigator;
