import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//import TabsNavigator from './Root/TabsNavigator';
import { DocumentsStackParamList } from './Root/types';
import { documentListScreens, documentScreens } from './Root/screens';

const DocumentsStack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  return (
    <DocumentsStack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...documentListScreens, ...documentScreens }).map(([name, component]) => (
        <DocumentsStack.Screen name={name as keyof DocumentsStackParamList} component={component} key={name} />
      ))}
    </DocumentsStack.Navigator>
  );


};

export default DocumentsNavigator;


