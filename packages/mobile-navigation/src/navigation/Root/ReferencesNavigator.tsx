import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ReferencesScreen from '../../screens/ReferencesScreen';

import { ReferenceStackParamList } from './types';

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="References" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        key="References"
        name="References"
        component={ReferencesScreen}
        options={{ title: 'Справочники' }}
      />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
