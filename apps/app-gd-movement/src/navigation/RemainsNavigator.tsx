import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RemainsStackParamList } from './Root/types';
import { remainsScreens, remainsListScreens } from './Root/screens';

const Stack = createStackNavigator<RemainsStackParamList>();

const RemainsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ContactList" screenOptions={{ headerShown: true, title: 'Остатки' }}>
      {Object.entries({ ...remainsListScreens, ...remainsScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof RemainsStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default RemainsNavigator;
