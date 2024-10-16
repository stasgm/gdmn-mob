import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { reportScreens } from './screens';

const Stack = createStackNavigator();

const ReportsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReportList" screenOptions={{ headerShown: true }}>
      {Object.entries({ ...reportScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
export default ReportsNavigator;
