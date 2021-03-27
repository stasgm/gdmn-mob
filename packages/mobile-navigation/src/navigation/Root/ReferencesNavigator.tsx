import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ReferencesScreen from '../../screens/ReferencesScreen';

type ReferenceStackParamList = {
  References: undefined;
};

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="References" screenOptions={{ headerShown: false }}>
      <Stack.Screen key="References" name="References" component={ReferencesScreen} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
