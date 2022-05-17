import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SettingsSceen from '../../screens/SettingsScreen';

import { SettingsStackParamList } from './types';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: true, title: 'Настройки' }}>
      <Stack.Screen key="Settings" name="Settings" component={SettingsSceen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
