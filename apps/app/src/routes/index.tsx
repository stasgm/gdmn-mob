import React from 'react';

// import { AuthNavigator, useAuth } from '@lib/mob-auth';

import DrawerNavigator from '../navigation/DrawerNavigator';

const Routes = () => {
  // const { user, device } = useAuth();
  const user = null;
  const device = null;

  return <DrawerNavigator />;
  //  return user && device ? <DrawerNavigator /> : <AuthNavigator />;
};

export default Routes;
