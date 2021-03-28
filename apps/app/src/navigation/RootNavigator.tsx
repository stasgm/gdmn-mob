import React from 'react';
import { useAddReducer } from '@lib/store';

import { DrawerNavigator } from '@lib/mobile-navigation';

import { INavItem } from '@lib/mobile-navigation/src/navigation/DrawerNavigator';

import MapScreen from '../screens/Maps';

import rootReducer from '../store/roodReducer';

import DashboardNavigator from './Root/DashboardNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';

console.log('RootNavigator');

const navItems: INavItem[] = [
  {
    name: 'Dashboard',
    title: 'Дашборд',
    icon: 'view-dashboard-outline',
    component: DashboardNavigator,
  },
  {
    name: 'Documents',
    title: 'Документы',
    icon: 'file-document-outline',
    component: DocumentsNavigator,
  },
  {
    name: 'Map',
    title: 'Карта',
    icon: 'map-outline',
    component: MapScreen,
  },
];

const RootNavigator = () => {
  useAddReducer('docs', rootReducer.docs);

  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
