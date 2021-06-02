import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteListScreen from '../../screens/Routes/RouteListScreen';
import RouteViewScreen from '../../screens/Routes/RouteViewScreen';
import RouteDetailScreen from '../../screens/Routes/RouteDetailScreen';

import { RoutesStackParamList } from './types';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RouteList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false, title: 'Маршруты' }}
    >
      <Stack.Screen name="RouteList" component={RouteListScreen} />
      <Stack.Screen name="RouteView" component={RouteViewScreen} />
      <Stack.Screen name="RouteDetails" component={RouteDetailScreen} />
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
