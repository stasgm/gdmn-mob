import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

import ProfileScreen from '../screens/ProfileScreen';

import MapScreen from '../screens/Maps';

import { DrawerContent } from './drawerContent';
import DashboardNavigator from './Root/DashboardNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import SettingsNavigator from './Root/SettingsNavigator';

export type RootDrawerParamList = {
  Dashboard: undefined;
  Documents: undefined;
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Map: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const Header = ({ scene }: DrawerHeaderProps) => {
  const { options } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => scene.descriptor.navigation.dispatch(DrawerActions.openDrawer())} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

console.log('DrawerNavigator');

const DrawerNavigator = () => {
  const { colors } = useTheme();
  return (
    <Drawer.Navigator
      drawerContentOptions={{ activeBackgroundColor: colors.primary, activeTintColor: '#ffffff' }}
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{ headerShown: true, header: props => <Header {...props} /> }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardNavigator}
        options={{
          title: 'Дашборд',
          drawerIcon: props => <Icon name="view-dashboard-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Documents"
        component={DocumentsNavigator}
        options={{
          title: 'Документы',
          drawerIcon: props => <Icon name="file-document-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          title: 'Справочники',
          drawerIcon: props => <Icon name="book-multiple-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Настройки',
          drawerIcon: props => <Icon name="tune" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Карта',
          drawerIcon: props => <Icon name="map-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          drawerIcon: props => <Icon name="account-circle-outline" {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
