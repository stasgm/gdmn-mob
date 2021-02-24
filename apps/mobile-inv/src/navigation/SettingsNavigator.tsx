import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { CompanyConfigScreen } from '../screens/App/CompanyConfigSceen';
import { SettingsScreen } from '../screens/App/SettingsScreen';

export type SettingsStackParamList = {
  Settings: undefined;
  CompanyConfig: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const ReferencesNavigator = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen key="Settings" name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
      <Stack.Screen key="CompanyConfig" name="CompanyConfig" component={CompanyConfigScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
