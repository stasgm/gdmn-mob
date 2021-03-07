import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DocumentsSceen from '../../screens/DocumentsScreen';

type DocumentsStackParamList = {
  Documents: undefined;
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: false }}>
      <Stack.Screen key="Documents" name="Documents" component={DocumentsSceen} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
