import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SettingsSceen from '../../screens/SettingsScreen';

import { SettingsStackParamList } from './types';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: true }}>
      <Stack.Screen key="Settings" name="Settings" component={SettingsSceen} options={{ title: 'Настройки' }} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
