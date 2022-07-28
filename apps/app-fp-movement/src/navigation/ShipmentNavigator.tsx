import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ShipmentStackParamList } from './Root/types';
import { shipmentListScreens, shipmentScreens } from './Root/screens';

const Stack = createStackNavigator<ShipmentStackParamList>();

export const ShipmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShipmentList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...shipmentListScreens, ...shipmentScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof ShipmentStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
