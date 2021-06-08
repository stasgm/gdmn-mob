import React from 'react';

import { DrawerNavigator } from '@lib/mobile-navigation';

import { INavItem } from '@lib/mobile-navigation/src/navigation/DrawerNavigator';

// import DashboardNavigator from './Root/DashboardNavigator';
import OrdersNavigator from './Root/OrdersNavigator';
import RoutesNavigator from './Root/RoutesNavigator';
import MapNavigator from './Root/Maps/MapNavigator';
import ReturnsNavigator from './Root/ReturnsNavigator';
// import DocumentsNavigator from './Root/';

const navItems: INavItem[] = [
  /*   {
      name: 'Dashboard',
      title: 'Дашборд',
      icon: 'view-dashboard-outline',
      component: DashboardNavigator,
    }, */
  {
    name: 'Routes',
    title: 'Маршруты',
    icon: 'routes',
    component: RoutesNavigator,
  },
  {
    name: 'Orders',
    title: 'Заявки',
    icon: 'clipboard-list-outline',
    component: OrdersNavigator,
  },
  {
    name: 'Returns',
    title: 'Возвраты',
    icon: 'clipboard-list-outline',
    component: ReturnsNavigator,
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
