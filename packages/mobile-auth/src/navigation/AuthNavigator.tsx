import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen, AppLoadScreen } from '../screens';

import { AuthStackParamList } from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { device, settings, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const saveSettings = useCallback(
    (newSettings: IApiConfig) => dispatch(authActions.setSettings(newSettings)),
    [dispatch],
  );

  const checkDevice = useCallback(() => dispatch(authActions.checkDevice()), [dispatch]);
  const activateDevice = useCallback((code: string) => dispatch(authActions.activateDevice(code)), [dispatch]);
  const disconnect = useCallback(() => dispatch(authActions.disconnect()), [dispatch]);
  const signIn = useCallback((credentials: IUserCredentials) => dispatch(authActions.signIn(credentials)), [dispatch]);
  const logout = useCallback(() => dispatch(authActions.logout()), [dispatch]);
  const setCompany = useCallback((company: ICompany) => dispatch(authActions.setCompany(company)), [dispatch]);

  const CongfigWithParams = useCallback(
    () => <ConfigScreen onSetSettings={saveSettings} settings={settings} />,
    [saveSettings, settings],
  );

  const SplashWithParams = useCallback(
    () => <SplashScreen settings={settings} onCheckDevice={checkDevice} />,
    [checkDevice, settings],
  );

  const SignInWithParams = useCallback(
    () => <SignInScreen onDisconnect={disconnect} onSignIn={signIn} />,
    [signIn, disconnect],
  );

  const ActivateWithParams = useCallback(
    () => <ActivationScreen onDisconnect={disconnect} onActivate={activateDevice} />,
    [activateDevice, disconnect],
  );

  const AppLoadWithParams = useCallback(
    () => <AppLoadScreen onSetCompany={setCompany} company={user?.company} onLogout={logout} />,
    [logout, setCompany, user?.company],
  );

  /*
    Если device undefined то переходим на окно с подключеним
    Если device null то переходим на окно активации устройства
    Если device не null и user undefined то переходим на окно входа пользователя
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
            name="Login"
            component={AppLoadWithParams}
            options={{ animationTypeForReplace: user ? 'pop' : 'push' }}
          />
        )
      ) : device === undefined ? (
        <>
          <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
          <AuthStack.Screen name="Config" component={CongfigWithParams} />
        </>
      ) : (
        <AuthStack.Screen name="Activation" component={ActivateWithParams} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
