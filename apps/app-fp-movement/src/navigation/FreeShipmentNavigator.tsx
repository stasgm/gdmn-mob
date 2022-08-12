import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { FreeShipmentStackParamList } from './Root/types';
import { freeShipmentListScreens, freeShipmentScreens } from './Root/screens';

const Stack = createStackNavigator<FreeShipmentStackParamList>();

export const FreeShipmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="FreeShipmentList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...freeShipmentListScreens, ...freeShipmentScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof FreeShipmentStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
