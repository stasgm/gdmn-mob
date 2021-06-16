import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteListScreen from '../../screens/Routes/RouteListScreen';
import RouteViewScreen from '../../screens/Routes/RouteViewScreen';
import RouteDetailScreen from '../../screens/Routes/RouteDetailScreen';

import {
  OrderEditScreen,
  OrderLineScreen,
  OrderViewScreen,
  SelectGoodScreen,
  SelectGroupScreen,
} from '../../screens/Orders';

import { ReturnLineScreen, ReturnViewScreen, ReturnEditScreen } from '../../screens/Returns';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { RoutesStackParamList, NestingOrderParamList, NestingReturnParamList, SelectParamList } from './types';

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
    component: SelectRefItemScreen,
  },
];

const selectItemRefScreens = [
  {
    name: 'SelectRefItem',
    component: SelectRefItemScreen,
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
      {selectItemRefScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof SelectParamList}
          component={screen.component}
          options={{ title: 'Поиск' }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
