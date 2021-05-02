import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { authActions, useSelector } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import { CompaniesScreen, SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens';

type AuthStackParamList = {
  Connection: undefined;
  Splash: undefined;
  Login: undefined;
  Config: undefined;
  Activation: undefined;
  Company: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { device, settings, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const saveSettings = useCallback((newSettings: IApiConfig) => dispatch(authActions.setSettings(newSettings)), [
    dispatch,
  ]);

  const checkDevice = useCallback(() => dispatch(authActions.checkDevice()), [dispatch]);

  const activateDevice = useCallback((code: string) => dispatch(authActions.activateDevice(code)), [dispatch]);

  const disconnect = useCallback(() => dispatch(authActions.disconnect()), [dispatch]);

  const signIn = useCallback((credentials: IUserCredentials) => dispatch(authActions.signIn(credentials)), [dispatch]);

  const logout = useCallback(() => dispatch(authActions.logout()), [dispatch]);

  const setCompany = useCallback((company: ICompany) => dispatch(authActions.setCompany(company)), [dispatch]);

  const CongfigWithParams = useCallback(() => <ConfigScreen onSetSettings={saveSettings} settings={settings} />, [
    saveSettings,
    settings,
  ]);

  const SplashWithParams = useCallback(() => <SplashScreen settings={settings} onCheckDevice={checkDevice} />, [
    checkDevice,
    settings,
  ]);

  const SignInWithParams = useCallback(() => <SignInScreen onDisconnect={disconnect} onSignIn={signIn} />, [
    signIn,
    disconnect,
  ]);

  const ActivateWithParams = useCallback(
    () => <ActivationScreen onDisconnect={disconnect} onActivate={activateDevice} />,
    [activateDevice, disconnect],
  );

  const CompaniesWithParams = useCallback(() => <CompaniesScreen onLogout={logout} onSetCompany={setCompany} />, [
    logout,
    setCompany,
  ]);

  useEffect(() => {
    console.log('mount nav');
    return () => {
      console.log('unmount nav');
    };
  }, []);

  /*
    Если device undefined то переходим на окно с подключеним
    Если device null то переходим на окно активации устройства
    Если device не null и user undefined то переходим на окно входа пользователя
    Если device не null и user не undefined или null то переходим на окно выбора компании
  */
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {device ? (
        !user ? (
          <AuthStack.Screen
            name="Login"
            component={SignInWithParams}
            options={{ animationTypeForReplace: user ? 'pop' : 'push' }}
          />
        ) : (
          <AuthStack.Screen
            name="Company"
            component={CompaniesWithParams}
            options={{ animationTypeForReplace: 'push' }}
          />
        )
      ) : device === undefined ? (
        <>
          <AuthStack.Screen name="Splash" component={SplashWithParams} />
          <AuthStack.Screen name="Config" component={CongfigWithParams} />
        </>
      ) : (
        <AuthStack.Screen name="Activation" component={ActivateWithParams} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
