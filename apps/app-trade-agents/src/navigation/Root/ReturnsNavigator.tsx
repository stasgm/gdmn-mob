import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { returnListScreens, returnScreens } from './screens';

const Stack = createStackNavigator();

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возвраты' }}>
      {Object.entries({ ...returnListScreens, ...returnScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
