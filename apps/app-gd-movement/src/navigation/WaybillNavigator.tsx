import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { WaybillStackParamList } from './Root/types';
import { waybillListScreens, waybillScreens } from './Root/screens';

const Stack = createStackNavigator<WaybillStackParamList>();

export const WaybillNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="WaybillList" screenOptions={{ headerShown: true, title: 'ЭТТН' }}>
      {Object.entries({ ...waybillListScreens, ...waybillScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof WaybillStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
