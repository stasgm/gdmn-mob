import React from 'react';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { INavItem, RootDrawerParamList } from './types';

import SettingsNavigator from './Root/SettingsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';
import ProfileNavigator from './Root/ProfileNavigator';
import { DrawerContent } from './drawerContent';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const baseNavList: INavItem[] = [
  {
    name: 'ReferencesNav',
    component: ReferencesNavigator,
    icon: 'file-cabinet',
    title: 'Справочники',
  },
  {
    name: 'SettingsNav',
    component: SettingsNavigator,
    icon: 'tune',
    title: 'Настройки',
  },
  {
    name: 'ProfileNav',
    component: ProfileNavigator,
    icon: 'account-circle-outline',
    title: 'Профиль',
  },
];

export interface IProps {
  items?: INavItem[];
  onSyncClick?: () => void;
}

const DrawerNavigator = ({ onSyncClick, ...props }: IProps) => {
  const { colors } = useTheme();
  const navList: INavItem[] = [...(props?.items || []), ...baseNavList];

  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: '#ffffff',
      }}
      drawerContent={(props) => <DrawerContent {...props} onSync={onSyncClick} />}
    >
      {navList.map((item) => (
        <Drawer.Screen
          name={item.name}
          key={item.name}
          component={item.component}
          options={{
            headerShown: false,
            title: item.title,
            drawerIcon: (pr) => <Icon name={item.icon} {...pr} />,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
