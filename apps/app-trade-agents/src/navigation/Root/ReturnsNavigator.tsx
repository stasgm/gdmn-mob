import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ReturnLineScreen,
  ReturnListScreen,
  ReturnViewScreen,
  ReturnEditScreen,
  SelectItemScreen as SelectItemReurnScreen,
} from '../../screens/Returns';

// import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { ReturnsStackParamList } from './types';

const Stack = createStackNavigator<ReturnsStackParamList>();

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возвраты' }}>
      <Stack.Screen name="ReturnList" component={ReturnListScreen} />
      <Stack.Screen name="ReturnView" component={ReturnViewScreen} />
      <Stack.Screen name="ReturnEdit" component={ReturnEditScreen} />
      <Stack.Screen name="ReturnLine" component={ReturnLineScreen} />
      {/* <Stack.Screen name="SelectRefItem" component={SelectRefItemScreen} /> */}
      <Stack.Screen name="SelectItemReturn" component={SelectItemReurnScreen} />
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
