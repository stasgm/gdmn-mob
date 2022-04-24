import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabsNavigator from './TabsNavigator';

export type DashboardStackParamList = {
  InvDashboard: undefined;
};

const DashboardStack = createStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator initialRouteName="InvDashboard" screenOptions={{ headerShown: true }}>
      <DashboardStack.Screen name="InvDashboard" component={TabsNavigator} options={{ title: 'Дашборд' }} />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
