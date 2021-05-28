import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from '@lib/store';

import DocumentListScreen from '../../screens/Documents/DocumentListScreen';

import DocumentViewScreen from '../../screens/Documents/DocumentViewScreen';

import TabsNavigator from './TabsNavigation';
import { DocumentsStackParamList } from './types';

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  const types = useSelector((state) => state.references).list.docTypes;

  return (
    <Stack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        key="Documents"
        name="Documents"
        component={types && types.data.length !== 0 ? TabsNavigator : DocumentListScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen key="DocumentView" name="DocumentView" component={DocumentViewScreen} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
