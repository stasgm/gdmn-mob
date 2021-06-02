import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabsNavigator from './DashboardTabsNavigator';

export type DashboardStackParamList = {
  Dashboard: undefined;
};

const DashboardStack = createStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: true }}>
      <DashboardStack.Screen name="Dashboard" component={TabsNavigator} options={{ title: 'Дашборд' }} />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
