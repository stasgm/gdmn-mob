import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RemainsStackParamList } from './types';
import { remainsScreens } from './screens';

const Stack = createStackNavigator();

const RemainsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ContactList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...remainsScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof RemainsStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default RemainsNavigator;
