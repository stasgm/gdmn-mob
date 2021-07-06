import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReturnsStackParamList } from './types';
import { returnListScreens, returnScreens } from './screens';

const Stack = createStackNavigator<ReturnsStackParamList>();

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возвраты' }}>
      {Object.entries({ ...returnListScreens, ...returnScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof ReturnsStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
