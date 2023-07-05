import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CurrShipmentStackParamList } from './Root/types';
import { currShipmentListScreens, currShipmentScreens } from './Root/screens';

const Stack = createStackNavigator<CurrShipmentStackParamList>();

export const CurrShipmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CurrShipmentList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...currShipmentListScreens, ...currShipmentScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof CurrShipmentStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
