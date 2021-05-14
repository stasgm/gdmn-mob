import React from 'react';

import { DrawerNavigator } from '@lib/mobile-navigation';

import { INavItem } from '@lib/mobile-navigation/src/navigation/DrawerNavigator';

import MapScreen from '../screens/Maps';

import DashboardNavigator from './Root/DashboardNavigator';
/*import DocumentsNavigator from './Root/DocumentsNavigator';
import ReferencesNavigator from './Root/ReferencesNavigator';*/

console.log('RootNavigator');

const navItems: INavItem[] = [
  {
    name: 'Dashboard',
    title: 'Дашборд',
    icon: 'view-dashboard-outline',
    component: DashboardNavigator,
  },
  /*{
    name: 'Documents',
    title: 'Документы',
    icon: 'file-document-outline',
    component: DocumentsNavigator,
  },
  {
    name: 'References',
    title: 'Справочники',
    icon: 'file-search-outline',
    component: ReferencesNavigator,
  },*/
  {
    name: 'Map',
    title: 'Карта',
    icon: 'map-outline',
    component: MapScreen,
  },
];

const RootNavigator = () => {
  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
