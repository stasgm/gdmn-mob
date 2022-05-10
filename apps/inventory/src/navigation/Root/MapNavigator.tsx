import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../../screens/Maps';

type MapStackParamList = {
  InvMap: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="InvMap" screenOptions={{ headerShown: true }}>
      <Stack.Screen key="References" name="InvMap" component={MapScreen} options={{ title: 'Карта' }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
