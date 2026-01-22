import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { shipmentScreens } from './screens';

const Stack = createStackNavigator();

const ShipmentNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ShipmentList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...shipmentScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default ShipmentNavigator;
