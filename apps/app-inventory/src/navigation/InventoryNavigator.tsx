import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { InventorysStackParamList } from './Root/types';
import { inventoryListScreens, inventoryScreens } from './Root/screens';

const Stack = createStackNavigator<InventorysStackParamList>();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="InventoryList" screenOptions={{ headerShown: true, title: 'Инвентаризации' }}>
      {Object.entries({ ...inventoryListScreens, ...inventoryScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof InventorysStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};