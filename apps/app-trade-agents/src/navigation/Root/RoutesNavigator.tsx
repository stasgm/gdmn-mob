import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RoutesStackParamList } from './types';
import { orderScreens, returnScreens, routerScreen } from './screens';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RouteList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false, title: 'Маршруты' }}
    >
      {Object.entries({
        ...routerScreen,
        ...orderScreens,
        ...returnScreens,
      }).map(([name, component]) => (
        <Stack.Screen name={name as keyof RoutesStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
