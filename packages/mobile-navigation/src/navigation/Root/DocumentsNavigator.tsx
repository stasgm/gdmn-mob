import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from '@lib/store';

import DocumentsScreen from '../../screens/Documents/DocumentsScreen';

// eslint-disable-next-line import/no-cycle
import DocumentViewScreen from '../../screens/Documents/DocumentViewScreen';

import TabsNavigator from './TabsNavigation';

export type DocumentsStackParamList = {
  Documents: undefined;
  DocumentView: { id: string };
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  const types = useSelector((state) => state.references).list.docTypes;

  return (
    <Stack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        key="Documents"
        name="Documents"
        component={types && types.data.length !== 0 ? TabsNavigator : DocumentsScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen key="DocumentView" name="DocumentView" component={DocumentViewScreen} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
