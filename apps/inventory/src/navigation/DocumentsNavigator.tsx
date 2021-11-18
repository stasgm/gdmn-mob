import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabsNavigator from './Root/TabsNavigator';

export type DocumentsStackParamList = {
  Documents: undefined;
};

const DocumentsStack = createStackNavigator<DocumentsStackParamList>();

const DocumentsNavigator = () => {
  return (
    <DocumentsStack.Navigator initialRouteName="Documents" screenOptions={{ headerShown: true, title: 'Документы' }}>
      <DocumentsStack.Screen name="Documents" component={TabsNavigator} options={{ title: 'Документы' }} />
    </DocumentsStack.Navigator>
  );
};
export default DocumentsNavigator;


/* const OrdersNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderList" screenOptions={{ headerShown: true, title: 'Заявки' }}>
      {Object.entries({ ...orderListScreens, ...orderScreens }).map(([name, component]) => (
        <Stack.Screen name={name as keyof OrdersStackParamList} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
};
 */
