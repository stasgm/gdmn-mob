import { DashboardStackParamList } from './types';
import DashboardScreen from '../../screens/DashboardScreen';
import { INavItem } from '../types';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';

const Stack = createStackNavigator<DashboardStackParamList>();

const DashboardNavigator = ({ dashboardScreens, items = [] }: { dashboardScreens: any; items?: INavItem[] }) => {
  const DashboardScreenComponent = useCallback(() => <DashboardScreen items={items} />, [items]);
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: true, title: 'GDMN Отгрузка', headerBackTitleVisible: false }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreenComponent} />
      {Object.entries(dashboardScreens).map(([name, { title, component }]: any) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
