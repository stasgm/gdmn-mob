/* eslint-disable no-shadow */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DocStackParamList } from './Root/types';
import { DocListScreens, DocScreens } from './Root/screens';

const Stack = createStackNavigator<DocStackParamList>();

export const DocNavigator = (props: any) => {
  const type = props.route.name;
  const title = props.route.params?.title;

  return (
    <Stack.Navigator initialRouteName="DocList" screenOptions={{ headerShown: true, title }}>
      {Object.entries({ ...DocListScreens, ...DocScreens }).map(([name, component]) => (
        <Stack.Screen
          name={name as keyof DocStackParamList}
          component={component}
          key={name}
          initialParams={{ type }}
        />
      ))}
    </Stack.Navigator>
  );
};
