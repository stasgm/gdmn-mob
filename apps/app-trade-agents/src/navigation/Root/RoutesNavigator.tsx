import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { RoutesStackParamList } from './types';
import { orderScreens, returnScreens, routerScreen } from './screens';

const Stack = createStackNavigator<RoutesStackParamList>();

const RoutesNavigator = () => {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName="RouteList"
        screenOptions={{ headerShown: true, headerBackTitleVisible: false, title: 'Маршруты' }}
      >
        {Object.entries({
          ...routerScreen,
          ...orderScreens,
          ...returnScreens,
        }).map(([name, component]) => (
          <Stack.Screen name={name as keyof RoutesStackParamList} component={component} key={name} />
        ))}
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};

export default RoutesNavigator;
