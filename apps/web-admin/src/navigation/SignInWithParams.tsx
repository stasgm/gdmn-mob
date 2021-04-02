import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { authActions } from '@lib/store';

import { IUserCredentials } from '@lib/types';

import Login from '../pages/Login';

const SignInWithParams: React.FC = () => {
  const dispatch = useDispatch();

  const signIn = useCallback((credentials: IUserCredentials) => dispatch(authActions.signIn(credentials)), [dispatch]);

  return <Login onSignIn={signIn} />;
};

export default SignInWithParams;
