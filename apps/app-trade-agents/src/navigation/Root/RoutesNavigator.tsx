import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RoutesStackParamList } from './types';
import RoutsTabsNavigator from './RoutesTabsNavigator';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RoutsTabsNavigator} options={{ title: 'Маршруты' }} />
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
