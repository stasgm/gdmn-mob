import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from 'react-native-paper';

import { DrawerContent } from './drawerContent';

import SettingsNavigator from './Root/SettingsNavigator';
import MessagesNavigator from './Root/MessagesNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
// import DocumentsNavigator from './Root/DocumentsNavigator';
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

// console.log('DrawerNavigator');

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
}

const baseNavList: INavItem[] = [
  /*   {
      name: 'Documents',
      component: DocumentsNavigator,
      icon: 'file-document-outline',
      title: 'Документы',
    }, */
  {
    name: 'References',
    component: ReferencesNavigator,
    icon: 'file-cabinet',
    title: 'Справочники',
  },
  {
    name: 'Messages',
    component: MessagesNavigator,
    icon: 'message-text-outline',
    title: 'Сообщения',
  },
  {
    name: 'Settings',
    component: SettingsNavigator,
    icon: 'tune',
    title: 'Настройки',
  },
  {
    name: 'Profile',
    component: ProfileNavigator,
    icon: 'account-circle-outline',
    title: 'Профиль',
  },
];

export interface IProps {
  items?: INavItem[];
}

const DrawerNavigator = (props: IProps) => {
  const { colors } = useTheme();

  const navList: INavItem[] = [...(props?.items || []), ...baseNavList];

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeBackgroundColor: colors.primary,
        activeTintColor: '#ffffff',
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {navList.map((item) => (
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
