import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ReturnLineScreen,
  ReturnListScreen,
  ReturnViewScreen,
  ReturnEditScreen,
  SelectItemScreen as SelectItemReurnScreen,
} from '../../screens/Returns';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { NestingReturnParamList, ReturnsStackParamList } from './types';

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
    component: SelectItemReurnScreen,
  },
  {
    name: 'SelectRefItem',
    component: SelectRefItemScreen,
  },
];

const ReturnsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReturnList" screenOptions={{ headerShown: true, title: 'Возвраты' }}>
      <Stack.Screen name="ReturnList" component={ReturnListScreen} />
      {returnScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof NestingReturnParamList}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};
export default ReturnsNavigator;
