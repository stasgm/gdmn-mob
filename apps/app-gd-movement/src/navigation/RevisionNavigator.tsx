import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RevisionStackParamList } from './Root/types';
import { revisionListScreens, revisionScreens } from './Root/screens';

const Stack = createStackNavigator<RevisionStackParamList>();

export const RevisionNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RevisionList" screenOptions={{ headerShown: true, title: 'Сверка' }}>
      {Object.entries({ ...revisionListScreens, ...revisionScreens }).map(([name, { title, component }]) => (
        <Stack.Screen
          name={name as keyof RevisionStackParamList}
          component={component}
          key={name}
          options={{ title }}
        />
      ))}
    </Stack.Navigator>
  );
};
