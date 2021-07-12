import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ApplsStackParamList } from './types';
import { applScreens } from './screens';

const Stack = createStackNavigator<ApplsStackParamList>();

const ApplsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ApplList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...applScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof ApplsStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};
export default ApplsNavigator;
