import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SettingsScreen from '../../screens/SettingsScreen';
import SettingsDetailsScreen from '../../screens/SettingsDetailsScreen';

import { SettingsStackParamList } from './types';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: true, title: 'Настройки' }}>
      <Stack.Screen key="Settings" name="Settings" component={SettingsScreen} />
      <Stack.Screen key="SettingsDetails" name="SettingsDetails" component={SettingsDetailsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
