import React from 'react';

import { SignInScreen } from '../screens/Auth';

// import { useAuthStore, useServiceStore } from '../store/auth';

// const isUser = (obj: unknown): obj is IUser => typeof obj === 'object' && 'id' in obj;

// import AuthNavigator from '../navigation/AuthNavigator';
// import DrawerNavigator from '../navigation/DrawerNavigator';

const AuthNavigator = () => {
  return <SignInScreen />;
};

export default AuthNavigator;
