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
  SelectRefItemScreen,
} from '../../screens/Orders';

import { ReturnLineScreen, ReturnViewScreen } from '../../screens/Returns';

import SelectItemScreen from '../../screens/Returns/SelectItemScreen';

import { RoutesStackParamList } from './types';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RouteList"
      screenOptions={{ headerShown: true, headerBackTitleVisible: false, title: 'Маршруты' }}
    >
      <Stack.Screen name="RouteList" component={RouteListScreen} />
      <Stack.Screen name="RouteView" component={RouteViewScreen} />
      <Stack.Screen name="RouteDetails" component={RouteDetailScreen} options={{ title: 'Визит' }} />
      <Stack.Screen name="OrderView" component={OrderViewScreen} options={{ title: 'Заявка' }} />
      <Stack.Screen name="OrderEdit" component={OrderEditScreen} options={{ title: 'Заявка' }} />
      <Stack.Screen name="OrderLine" component={OrderLineScreen} options={{ title: 'Заявка' }} />
      <Stack.Screen name="SelectGroupItem" component={SelectGroupScreen} />
      <Stack.Screen name="SelectGoodItem" component={SelectGoodScreen} />
      <Stack.Screen name="SelectRefItem" component={SelectRefItemScreen} options={{ title: 'Заявка' }} />
      <Stack.Screen name="ReturnView" component={ReturnViewScreen} options={{ title: 'Возвраты' }} />
      <Stack.Screen name="ReturnLine" component={ReturnLineScreen} options={{ title: 'Возвраты' }} />
      <Stack.Screen name="SelectItemReturn" component={SelectItemScreen} options={{ title: 'Возвраты' }} />
    </Stack.Navigator>
  );
};

export default RoutesNavigator;
