import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import InformationLogScreen from '../../screens/InformationLogScreen';
import InformationScreen from '../../screens/InformationScreen';

import { InformationStackParamList } from './types';

const Stack = createStackNavigator<InformationStackParamList>();

const InformationNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Information" screenOptions={{ headerShown: true, title: 'О программе' }}>
      <Stack.Screen key="Informatiion" name="Information" component={InformationScreen} />
      <Stack.Screen key="Log" name="Log" component={InformationLogScreen} options={{ title: 'Журнал ошибок' }} />
    </Stack.Navigator>
  );
};

export default InformationNavigator;
