import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ReturnLineScreen, ReturnListScreen, ReturnViewScreen } from '../../screens/Returns';

import ReturnEditScreen from '../../screens/Returns/ReturnEditScreen';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';
import SelectItemScreen from '../../screens/Returns/SelectItemScreen';

import { NestingReturnParamList, ReturnsStackParamList, SelectParamList } from './types';

const Stack = createStackNavigator<ReturnsStackParamList>();

const returnScreens = [
  {
    name: 'ReturnView',
    component: ReturnViewScreen,
  },
  {
    name: 'ReturnEdit',
    component: ReturnEditScreen,
  },
  {
    name: 'ReturnLine',
    component: ReturnLineScreen,
  },
  {
    name: 'SelectItemReturn',
    component: SelectItemScreen,
  },
  {
    name: 'SelectRefItem',
    component: SelectRefItemScreen,
  },
];

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возврат' }}>
      <Stack.Screen name="ReturnList" component={ReturnListScreen} />
      {returnScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof NestingReturnParamList | keyof SelectParamList}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
