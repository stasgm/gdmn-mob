import React from 'react';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';

import DashboardNavigator from './Root/DashboardNavigator';
import DocumentsNavigator from './Root/DocumentsNavigator';
import LocationNavigator from './Root/Maps/MapNavigator';

const navItems: INavItem[] = [
  {
    name: 'MyDashboard',
    title: 'Дашборд',
    icon: 'view-dashboard-outline',
    component: DashboardNavigator,
  },
  {
    name: 'MyDocuments',
    title: 'Документы',
    icon: 'file-document-outline',
    component: DocumentsNavigator,
  },
  {
    name: 'MyMap',
    title: 'Карта',
    icon: 'map-outline',
    component: LocationNavigator,
  },
];

const RootNavigator = () => {
  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
