import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from '@lib/store';

import DocumentsScreen from '../../screens/DocumentsScreen';

import TabsNavigator from './TabsNavigation';

type DocumentsStackParamList = {
  Documents: undefined;
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  const types = useSelector((state) => state.references).list.docTypes;

  return (
    <Stack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        key="Documents"
        name="Documents"
        component={types && types.data.length !== 0 ? TabsNavigator : DocumentsScreen}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
