import React from 'react';

import { useAuth } from '../context/auth';

import DrawerNavigator from '../navigation/DrawerNavigator';

import AuthNavigator from './auth.router';

const Routes = () => {
  const { user } = useAuth();

  return user ? <DrawerNavigator /> : <AuthNavigator />;
};

export default Routes;
