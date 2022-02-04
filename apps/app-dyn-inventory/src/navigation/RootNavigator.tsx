/* eslint-disable no-shadow */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DocStackParamList } from './Root/types';
import { DocListScreens, DocScreens } from './Root/screens';

const Stack = createStackNavigator<DocStackParamList>();

export const RootNavigator = (props: any) => {
  const { name } = props.route;
  const nameDocument = name as string;

  const { params } = props.route;
  const titleDoc = params?.titleDoc as string;

  return (
    <Stack.Navigator initialRouteName="DocList" screenOptions={{ headerShown: true, title: titleDoc }}>
      {Object.entries({ ...DocListScreens, ...DocScreens }).map(([name, component]) => (
        <Stack.Screen
          name={name as keyof DocStackParamList}
          component={component}
          key={name}
          initialParams={{ docType: nameDocument }}
        />
      ))}
    </Stack.Navigator>
  );
};
