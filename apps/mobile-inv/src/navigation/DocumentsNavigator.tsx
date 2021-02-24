import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DocumentListScreen, DocumentRequestScreen, FilterEditScreen } from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentList: undefined;
  FilterEdit: undefined;
  DocumentRequest: undefined;
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="DocumentList"
      screenOptions={{ headerStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen
        key="DocumentList"
        name="DocumentList"
        component={DocumentListScreen}
        options={{
          title: 'Документы',
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen key="FilterEdit" name="FilterEdit" component={FilterEditScreen} options={{ title: '' }} />
      <Stack.Screen
        key="DocumentRequest"
        name="DocumentRequest"
        component={DocumentRequestScreen}
        options={{ title: 'Загрузить документы' }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
