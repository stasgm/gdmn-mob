import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from 'react-native-paper';

import { DrawerContent } from './drawerContent';

import SettingsNavigator from './Root/SettingsNavigator';
import MessagesNavigator from './Root/MessagesNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';
import ProfileNavigator from './Root/ProfileNavigator';

export type RootDrawerParamList = {
  Dashboard: undefined;
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Messages: undefined;
  [itemName: string]: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

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
        component={ProfileNavigator}
        options={{
          title: 'Профиль',
          drawerIcon: (props) => <Icon name="account-circle-outline" {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
