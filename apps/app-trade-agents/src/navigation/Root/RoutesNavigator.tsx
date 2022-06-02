import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { orderScreens, returnScreens, routerScreen } from './screens';

const Stack = createStackNavigator();

const RoutesNavigator = () => {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName="RouteList"
        screenOptions={{ headerShown: true, headerBackTitleVisible: false }}
      >
        {Object.entries({
          ...routerScreen,
          ...orderScreens,
          ...returnScreens,
        }).map(([name, { title, component }]) => (
          <Stack.Screen name={name} component={component} key={name} options={{ title }} />
        ))}
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};

export default RoutesNavigator;
