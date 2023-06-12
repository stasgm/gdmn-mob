import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { InventoryStackParamList } from './Root/types';
import { inventoryListScreens, inventoryScreens } from './Root/screens';

const Stack = createStackNavigator<InventoryStackParamList>();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="InventoryList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...inventoryListScreens, ...inventoryScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof InventoryStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
