import { ReferenceStackParamList } from './types';
import { ReferenceDetailScreen, ReferenceListScreen, ReferenceViewScreen } from '../../screens/References';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReferenceList"
      screenOptions={{ headerShown: true, title: 'Справочники', headerBackTitleVisible: false }}
    >
      <Stack.Screen name="ReferenceList" component={ReferenceListScreen} />
      <Stack.Screen name="ReferenceView" component={ReferenceViewScreen} />
      <Stack.Screen name="ReferenceDetals" component={ReferenceDetailScreen} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
