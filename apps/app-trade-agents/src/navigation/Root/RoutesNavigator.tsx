import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteListScreen from '../../screens/Routes/RouteListScreen';
import RouteViewScreen from '../../screens/Routes/RouteViewScreen';

import { RoutesStackParamList } from './types';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RouteList" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="RouteList" component={RouteListScreen} options={{ title: 'Маршруты' }} />
      <Stack.Screen name="RouteView" component={RouteViewScreen} options={{ title: 'Маршрут' }} />
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
