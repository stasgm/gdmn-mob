import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { debetListScreens } from './screens';

const Stack = createStackNavigator();

const DebetsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DebetList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...debetListScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default DebetsNavigator;
