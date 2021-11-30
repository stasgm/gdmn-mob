import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DocumentsStackParamList } from './Root/types';
import { documentListScreens, documentScreens } from './Root/screens';

const DocumentsStack = createStackNavigator<DocumentsStackParamList>();

export const DocumentsNavigator = () => {
  return (
    <DocumentsStack.Navigator initialRouteName="DocumentList" screenOptions={{ headerShown: true, title: 'Документы' }}>
      {Object.entries({ ...documentListScreens, ...documentScreens }).map(([name, component]) => (
        <DocumentsStack.Screen name={name as keyof DocumentsStackParamList} component={component} key={name} />
      ))}
    </DocumentsStack.Navigator>
  );
};
