/* eslint-disable no-shadow */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MovementStackParamList } from './Root/types';
import { movementListScreens, movementScreens } from './Root/screens';

const Stack = createStackNavigator<MovementStackParamList>();

export const MovementNavigator = (props: any) => {
  const { name } = props.route;
  const nameDocument = name as string;

  const { params } = props.route;
  const titleDoc = params?.titleDoc as string;

  return (
    <Stack.Navigator initialRouteName="MovementList" screenOptions={{ headerShown: true, title: titleDoc }}>
      {Object.entries({ ...movementListScreens, ...movementScreens }).map(([name, component]) => (
        <Stack.Screen
          name={name as keyof MovementStackParamList}
          component={component}
          key={name}
          initialParams={{ docType: nameDocument }}
        />
      ))}
    </Stack.Navigator>
  );
};
