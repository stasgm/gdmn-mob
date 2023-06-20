import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReceiptStackParamList } from './Root/types';
import { prihodListScreens, prihodScreens } from './Root/screens';

const Stack = createStackNavigator<ReceiptStackParamList>();

export const ReceiptNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReceiptList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
    >
      {Object.entries({ ...prihodListScreens, ...prihodScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof ReceiptStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
