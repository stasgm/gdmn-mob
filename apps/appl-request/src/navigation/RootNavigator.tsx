import React from 'react';

import { DrawerNavigator } from '@lib/mobile-navigation';

import { INavItem } from '@lib/mobile-navigation/src/navigation/DrawerNavigator';

import ApplNavigator from './Root/ApplNavigator';

const navItems: INavItem[] = [
  {
    name: 'Appl',
    title: 'Заявки',
    icon: 'clipboard-list-outline',
    component: ApplNavigator,
  },
];

const RootNavigator = () => {
  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
