import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DocStackParamList } from './Root/types';
import { docListScreens, docScreens } from './Root/screens';

const Stack = createStackNavigator<DocStackParamList>();

export const DocNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DocList" screenOptions={{ headerShown: true, title: 'Документы' }}>
      {Object.entries({ ...docListScreens, ...docScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof DocStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
