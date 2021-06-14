import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReturnLineScreen, ReturnListScreen, ReturnViewScreen } from '../../screens/Returns';

import ReturnEditScreen from '../../screens/Returns/ReturnEditScreen';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';
import SelectItemScreen from '../../screens/Returns/SelectItemScreen';

import { ReturnsStackParamList } from './types';

const Stack = createStackNavigator<ReturnsStackParamList>();

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возврат' }}>
      <Stack.Screen name="ReturnList" component={ReturnListScreen} />
      <Stack.Screen name="ReturnView" component={ReturnViewScreen} />
      <Stack.Screen name="ReturnEdit" component={ReturnEditScreen} />
      <Stack.Screen name="ReturnLine" component={ReturnLineScreen} />
      <Stack.Screen name="SelectRefItem" component={SelectRefItemScreen} />
      <Stack.Screen name="SelectItemReturn" component={SelectItemScreen} />
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
