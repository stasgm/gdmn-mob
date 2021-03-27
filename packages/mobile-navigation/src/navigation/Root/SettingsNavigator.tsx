import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SettingsSceen from '../../screens/SettingsScreen';

type SettingsStackParamList = {
  Settings: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
      <Stack.Screen key="Settings" name="Settings" component={SettingsSceen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
