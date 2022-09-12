import React from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AppNavigator, MapNavigator } from '../navigation';
import { theme } from '../constants';

import TodoNavigator from '../features/todos/navigation/TodoStack';

import { DrawerContent } from './drawerContent';
import { INavItem, RootDrawerParamList } from './types';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const baseNavList: INavItem[] = [
  {
    name: 'Todo',
    component: TodoNavigator,
    icon: 'check-box-outline',
    title: 'Todo',
  },
  {
    name: 'App',
    component: AppNavigator,
    icon: 'file-cabinet',
    title: 'App',
  },
  {
    name: 'Map',
    component: MapNavigator,
    icon: 'map',
    title: 'Map',
  },
  {
    name: 'Documents',
    component: AppNavigator,
    icon: 'file-document',
    title: 'Documents',
  },
];

const DrawerNavigator = () => {
  const navList: INavItem[] = baseNavList;

  return (
    <Drawer.Navigator
      defaultStatus="closed"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerStyle: {
          backgroundColor: theme.background,
        },
        // drawerActiveBackgroundColor: '#F4F6FB',
        drawerActiveTintColor: theme.active,
        drawerInactiveTintColor: theme.inactive,
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {navList.map((item) => (
        <Drawer.Screen
          name={item.name}
          key={item.name}
          component={item.component}
          options={{
            title: item.title,
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: (pr) => <Icon name={item.icon} {...pr} />,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
