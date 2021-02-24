import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTheme } from 'react-native-paper';

import { ReferenceListScreen } from '../screens/App/References';

type ReferenceStackParamList = {
  ReferenceList: undefined;
};

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="ReferenceList"
      screenOptions={{ headerStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen
        key="ReferenceList"
        name="ReferenceList"
        component={ReferenceListScreen}
        options={{ title: 'Справочники' }}
      />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
