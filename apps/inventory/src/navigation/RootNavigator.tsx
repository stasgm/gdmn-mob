import React from 'react';

import { DrawerNavigator } from '@lib/mobile-navigation';

import { INavItem } from '@lib/mobile-navigation/src/navigation/DrawerNavigator';

import DashboardNavigator from './Root/DashboardNavigator';
import MapNavigator from './Root/MapNavigator';

console.log('RootNavigator');

const navItems: INavItem[] = [
  {
    name: 'Dashboard',
    title: 'Дашборд',
    icon: 'view-dashboard-outline',
    component: DashboardNavigator,
  },
  {
    name: 'Map',
    title: 'Карта',
    icon: 'map-outline',
    component: MapNavigator,
  },
];

const RootNavigator = () => {
  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
