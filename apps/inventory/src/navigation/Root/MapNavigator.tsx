import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Header } from '@lib/mobile-navigation';

import MapScreen from '../../screens/Maps';

type MapStackParamList = {
  Map: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{ headerShown: true, header: (props) => <Header {...props} /> }}
    >
      <Stack.Screen key="References" name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
