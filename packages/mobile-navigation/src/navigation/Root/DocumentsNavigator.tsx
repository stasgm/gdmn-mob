import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DocumentsSceen from '../../screens/DocumentsScreen';

type DocumentsStackParamList = {
  Documents: undefined;
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: true }}>
      <Stack.Screen key="Documents" name="Documents" component={DocumentsSceen} options={{ title: 'Документы' }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
