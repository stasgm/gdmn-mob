import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../../screens/Maps';

type MapStackParamList = {
  Map: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Map" screenOptions={{ headerShown: true }}>
      <Stack.Screen key="References" name="Map" component={MapScreen} options={{ title: 'Карта' }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
