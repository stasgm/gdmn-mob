import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReturnLineScreen, ReturnListScreen, ReturnViewScreen, SelectItemScreen } from '../../screens/Returns';

import { ReturnsStackParamList } from './types';

const Stack = createStackNavigator<ReturnsStackParamList>();

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возврат' }}>
      <Stack.Screen name="ReturnList" component={ReturnListScreen} />
      <Stack.Screen name="ReturnView" component={ReturnViewScreen} />
      <Stack.Screen name="ReturnLine" component={ReturnLineScreen} />
      <Stack.Screen name="SelectItem" component={SelectItemScreen} />
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
