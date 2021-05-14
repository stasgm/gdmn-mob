import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

import ProfileScreen from '../screens/ProfileScreen';

import { DrawerContent } from './drawerContent';

//import ReferencesNavigator from "./Root/ReferencesNavigator";
import SettingsNavigator from './Root/SettingsNavigator';
import MessagesNavigator from './Root/MessagesNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';

export type RootDrawerParamList = {
  Dashboard: undefined;
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Messages: undefined;
  [itemName: string]: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const Header = ({ scene }: DrawerHeaderProps) => {
  const { options, navigation } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <Appbar.Content title={title} />
      {/* <Appbar.Action icon="dots-vertical" /> */}
    </Appbar.Header>
  );
};

console.log('DrawerNavigator');

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
}

export interface IProps {
  items?: INavItem[];
}

const DrawerNavigator = (props: IProps) => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeBackgroundColor: colors.primary,
        activeTintColor: '#ffffff',
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
      }}
    >
      {props?.items?.map((item) => (
        <Drawer.Screen
          name={item.name}
          key={item.name}
          component={item.component}
          options={{
            title: item.title,
            drawerIcon: (pr) => <Icon name={item.icon} {...pr} />,
          }}
        />
      ))}
      <Drawer.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          title: 'Сообщения',
          drawerIcon: (props) => <Icon name="message-text-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          title: 'Справочники',
          drawerIcon: (props) => <Icon name="file-search-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Documents"
        component={DocumentsNavigator}
        options={{
          title: 'Документы',
          drawerIcon: (props) => <Icon name="file-document-outline" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Настройки',
          drawerIcon: (props) => <Icon name="tune" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          drawerIcon: (props) => <Icon name="account-circle-outline" {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
