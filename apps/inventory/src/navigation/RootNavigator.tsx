import React from 'react';

import { INavItem, DrawerNavigator } from '@lib/mobile-navigation';

import DocumentsNavigator from './Root/DocumentsNavigator';


const navItems: INavItem[] = [
  {
    name: 'Documents',
    title: 'Документы',
    icon: 'file-document-outline',
    component: DocumentsNavigator,
  },
];

const RootNavigator = () => {
  return <DrawerNavigator items={navItems} />;
};

export default RootNavigator;
