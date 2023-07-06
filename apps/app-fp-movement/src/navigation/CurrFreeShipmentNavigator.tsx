import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CurrFreeShipmentStackParamList } from './Root/types';
import { currFreeShipmentListScreens, currFreeShipmentScreens } from './Root/screens';

const Stack = createStackNavigator<CurrFreeShipmentStackParamList>();

export const CurrFreeShipmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CurrFreeShipmentList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...currFreeShipmentListScreens, ...currFreeShipmentScreens }).map(
        ([name, { title, component }]) => (
          <Stack.Screen
            name={name as keyof CurrFreeShipmentStackParamList}
            component={component}
            key={name}
            options={{ title }}
          />
        ),
      )}
    </Stack.Navigator>
  );
};
