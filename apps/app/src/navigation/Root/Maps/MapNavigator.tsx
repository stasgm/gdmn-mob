import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import MapTabsStack from './MapTabsNavigator';

export type LocationStackParamList = {
  Location: undefined;
};

const LocationStack = createStackNavigator<LocationStackParamList>();

const LocationNavigator = () => {
  return (
    <LocationStack.Navigator initialRouteName="Location" screenOptions={{ headerShown: true, title: 'Карта' }}>
      <LocationStack.Screen name="Location" component={MapTabsStack} />
    </LocationStack.Navigator>
  );
};

export default LocationNavigator;
