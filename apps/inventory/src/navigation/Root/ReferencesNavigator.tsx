import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ReferencesScreen from '../../screens/ReferencesScreen';

type ReferencesStackParamList = {
  References: undefined;
};

const Stack = createStackNavigator<ReferencesStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="References" screenOptions={{ headerShown: false }}>
      <Stack.Screen key="References" name="References" component={ReferencesScreen} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
