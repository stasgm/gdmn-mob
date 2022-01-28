/* eslint-disable no-shadow */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { InventoryStackParamList } from './Root/types';
import { inventoryListScreens, inventoryScreens } from './Root/screens';

const Stack = createStackNavigator<InventoryStackParamList>();

export const InventoryNavigator = (props: any) => {
  const { name } = props.route;
  const nameDocument = name as string;

  const { params } = props.route;
  const titleDoc = params?.titleDoc as string;

  return (
    <Stack.Navigator initialRouteName="InventoryList" screenOptions={{ headerShown: true, title: titleDoc }}>
      {Object.entries({ ...inventoryListScreens, ...inventoryScreens }).map(([name, component]) => (
        <Stack.Screen
          name={name as keyof InventoryStackParamList}
          component={component}
          key={name}
          initialParams={{ docType: nameDocument }}
        />
      ))}
    </Stack.Navigator>
  );
};
