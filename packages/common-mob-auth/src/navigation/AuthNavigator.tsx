import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authActions, RootState } from '@lib/common-store';

import { IUserCredentials } from '@lib/common-types';

import { IApiConfig } from '@lib/common-client-types';

import { ConfigScreen } from '../screens/ConfigScreen';
import { ActivationScreen } from '../screens/ActivationScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SplashScreen } from '../screens/SplashScreen';

type AuthStackParamList = {
  Connection: undefined;
  Splash: undefined;
  Login: undefined;
  Config: undefined;
  Activation: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const {
    device,
    settings,
    error,
    loading,
    status,
    settingsForm,
  } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const showSettings = (visible: boolean) =>
    dispatch(authActions.setSettingsForm(visible));
  const saveSettings = (settings: IApiConfig) =>
    dispatch(authActions.setSettings(settings));
  const checkDevice = () => dispatch(authActions.checkDevice());
  const disconnect = () => dispatch(authActions.disconnect());
  const signIn = (credentials: IUserCredentials) =>
    dispatch(authActions.signIn(credentials));

  const serverReq = {
    isError: error,
    isLoading: loading,
    status: status,
  };

  const CongfigWithParams = useCallback(
    () => (
      <ConfigScreen
        setSettings={saveSettings}
        showSettings={showSettings}
        settings={settings}
      />
    ),
    [saveSettings, showSettings, settings]
  );

  const SplashWithParams = useCallback(
    () => (
      <SplashScreen
        serverReq={serverReq}
        onShowSettings={showSettings}
        settings={settings}
        onCheckDevice={checkDevice}
      />
    ),
    [checkDevice, showSettings, serverReq, settings]
  );

  const SignInWithParams = useCallback(
    () => (
      <SignInScreen
        serverReq={serverReq}
        onDisconnect={disconnect}
        onSignIn={signIn}
      />
    ),
    [signIn, disconnect, serverReq]
  );

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {device ? (
        <AuthStack.Screen
          name="Login"
          component={SignInWithParams}
          options={{ animationTypeForReplace: 'push' }}
        />
      ) : settingsForm ? (
        <AuthStack.Screen name="Config" component={CongfigWithParams} />
      ) : device === undefined ? (
        <AuthStack.Screen
          name="Splash"
          component={SplashWithParams}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ) : (
        <AuthStack.Screen name="Activation" component={ActivationScreen} />
      )}
    </AuthStack.Navigator>
  );
};

export { AuthNavigator };
