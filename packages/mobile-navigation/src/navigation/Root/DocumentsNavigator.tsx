import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DocumentsStackParamList } from './types';
import TabsNavigator from './DocumentsTabsNavigator';

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="TabsNavigator" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="TabsNavigator" component={TabsNavigator} options={{ title: 'Документы' }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
