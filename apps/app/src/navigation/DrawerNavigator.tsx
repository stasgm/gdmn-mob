import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import { DrawerContent } from './drawerContent';
import RootNavigator from './RootNavigator';

export type RootDrawerParamList = {
  Root: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Root" component={RootNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
