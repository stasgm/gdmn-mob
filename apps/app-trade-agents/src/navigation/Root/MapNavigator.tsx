import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../../screens/Maps';

import { MapStackParamList } from './types';

const Stack = createStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MapGeoView" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="MapGeoView" component={MapScreen} options={{ title: 'Карта' }} />
      <Stack.Screen name="ListGeoView" component={MapScreen} options={{ title: 'Список геоточек' }} />
    </Stack.Navigator>
  );
};
export default MapNavigator;
