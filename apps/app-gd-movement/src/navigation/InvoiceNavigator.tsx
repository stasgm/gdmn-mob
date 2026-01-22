import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { InvoiceStackParamList } from './Root/types';
import { invoiceListScreens, invoiceScreens } from './Root/screens';

const Stack = createStackNavigator<InvoiceStackParamList>();

export const InvoiceNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="InvoiceList" screenOptions={{ headerShown: true, title: 'Документы' }}>
      {Object.entries({ ...invoiceListScreens, ...invoiceScreens }).map(([name, { title, component }]) => (
        <Stack.Screen name={name as keyof InvoiceStackParamList} component={component} key={name} options={{ title }} />
      ))}
    </Stack.Navigator>
  );
};
