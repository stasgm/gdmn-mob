import { DrawerActions } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { Appbar } from 'react-native-paper';

import DashboardNavigator from './Root/DashboardNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import SettingsNavigator from './Root/SettingsNavigator';

export type RootStackParamList = {
  Dashboard: undefined;
  Documents: undefined;
  References: undefined;
  Settings: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const Header = ({ scene, previous, navigation }: StackHeaderProps) => {
  const { options } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.Action icon="backburger" onPress={navigation.goBack} />
      ) : (
        <Appbar.Action icon="menu" onPress={() => scene.descriptor.navigation.dispatch(DrawerActions.openDrawer())} />
      )}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

console.log('RootNavigator');

const RootNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Dashboard"
      headerMode="screen"
      screenOptions={{ header: props => <Header {...props} /> }}
    >
      <RootStack.Screen name="Dashboard" component={DashboardNavigator} options={{ title: 'Дашборд' }} />
      <RootStack.Screen name="Documents" component={DocumentsNavigator} options={{ title: 'Документы' }} />
      <RootStack.Screen name="References" component={ReferencesNavigator} options={{ title: 'Справочники' }} />
      <RootStack.Screen name="Settings" component={SettingsNavigator} options={{ title: 'Настройки' }} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
