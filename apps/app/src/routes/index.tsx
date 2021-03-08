import React from 'react';

import { useAuth } from '../context/auth';
import DrawerNavigator from '../navigation/DrawerNavigator';

import AuthNavigator from '../navigation/AuthNavigator';

const Routes = () => {
  const { user, device } = useAuth();

  return user && device ? <DrawerNavigator /> : <AuthNavigator />;
};

export default Routes;
