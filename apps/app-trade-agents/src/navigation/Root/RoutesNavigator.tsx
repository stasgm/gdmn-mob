import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RouteViewScreen, RouteListScreen, RouteDetailScreen } from '../../screens/Routes/';

import {
  OrderEditScreen,
  OrderLineScreen,
  OrderViewScreen,
  SelectGoodScreen,
  SelectGroupScreen,
} from '../../screens/Orders';

import { ReturnLineScreen, ReturnViewScreen, ReturnEditScreen, SelectItemScreen } from '../../screens/Returns';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { RoutesStackParamList, NestingOrderParamList, NestingReturnParamList } from './types';

const Stack = createStackNavigator<RoutesStackParamList>();

const orderScreens = [
  {
    name: 'OrderView',
    component: OrderViewScreen,
  },
  {
    name: 'OrderEdit',
    component: OrderEditScreen,
  },
  {
    name: 'OrderLine',
    component: OrderLineScreen,
  },
  {
    name: 'SelectGroupItem',
    component: SelectGroupScreen,
  },
  {
    name: 'SelectGoodItem',
    component: SelectGoodScreen,
  },
  {
    name: 'SelectRefItem',
    component: SelectRefItemScreen,
  },
];

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
];

const RoutesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RouteList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false, title: 'Маршруты' }}
    >
      <Stack.Screen name="RouteList" component={RouteListScreen} />
      <Stack.Screen name="RouteView" component={RouteViewScreen} />
      <Stack.Screen name="RouteDetails" component={RouteDetailScreen} options={{ title: 'Визит' }} />
      {orderScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof NestingOrderParamList}
          component={screen.component}
          options={{ title: 'Заявка' }}
        />
      ))}
      {returnScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof NestingReturnParamList}
          component={screen.component}
          options={{ title: 'Возврат' }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
