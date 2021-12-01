import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { InventorysStackParamList } from './Root/types';
import { inventoryListScreens, inventoryScreens } from './Root/screens';

const InventorysStack = createStackNavigator<InventorysStackParamList>();

export const InventorysNavigator = () => {
  return (
    <InventorysStack.Navigator
      initialRouteName="InventorytList"
      screenOptions={{ headerShown: true, title: 'Инвентаризации' }}
    >
      {Object.entries({ ...inventoryListScreens, ...inventoryScreens }).map(([name, component]) => (
        <InventorysStack.Screen name={name as keyof InventorysStackParamList} component={component} key={name} />
      ))}
    </InventorysStack.Navigator>
  );
};
