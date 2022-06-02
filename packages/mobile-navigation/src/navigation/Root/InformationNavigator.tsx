import { DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import InformationScreen from '../../screens/InformationScreen';

import { InformationStackParamList } from './types';

const Stack = createStackNavigator<InformationStackParamList>();

const InformationNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Information" screenOptions={{ headerShown: true, title: 'О программе' }}>
      <Stack.Screen key="Informatiion" name="Information" component={InformationScreen} />
    </Stack.Navigator>
  );
};

export default InformationNavigator;
