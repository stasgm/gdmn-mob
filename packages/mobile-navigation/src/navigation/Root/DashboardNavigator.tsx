import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabsNavigator from './TabsNavigator';

export type DashboardStackParamList = {
  Dashboard: undefined;
};

const DashboardStack = createStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Dashboard" component={TabsNavigator} />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
