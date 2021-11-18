import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen, AppLoadScreen } from '../screens';

import { AuthStackParamList } from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { settings, user, connectionStatus } = useSelector((state) => state.auth);
  const dispatch = useAuthThunkDispatch();

  useEffect(() => {
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...settings };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log('settings111', settings);

  const disconnect = useCallback(() => {
    dispatch(authActions.disconnect());
  }, [dispatch]);

  const saveSettings = useCallback(
    (newSettings: IApiConfig) => {
      if (newSettings.deviceId === '') {
        disconnect();
      }
      dispatch(authActions.setSettings(newSettings));
      api.config = { ...newSettings };
    },
    [disconnect, dispatch],
  );

  const checkDevice = useCallback(() => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе connectionStatus = 'not-activated', переходим на окно ввода кода
    dispatch(authActions.getDeviceStatus(settings?.deviceId));
    //Получим устройство по uid
    if (settings?.deviceId && user) {
      dispatch(authActions.getDeviceByUid(settings.deviceId));
    }
  }, [dispatch, settings?.deviceId, user]);

  const activateDevice = useCallback(
    async (code: string) => {
      const res = await dispatch(authActions.activateDevice(code));
      if (res.type === 'AUTH/ACTIVATE_DEVICE_SUCCESS') {
        //Если устройство прошло активацию по коду,
        //то запишем uId в конфиг api и в настройки
        dispatch(authActions.setSettings({ ...settings, deviceId: res.payload }));
        api.config.deviceId = res.payload;
      }
    },
    [dispatch, settings],
  );

  const signIn = useCallback(
    async (credentials: IUserCredentials) => {
      const res = await dispatch(authActions.signIn(credentials));
      if (settings?.deviceId && res.type === 'AUTH/LOGIN_SUCCESS') {
        dispatch(authActions.getDeviceByUid(settings.deviceId));
      }
    },
    [dispatch, settings.deviceId],
  );

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
    Если connectionStatus = 'not-connected', то переходим на окно с подключеним
    Если connectionStatus = 'connected' и user undefined то переходим на окно входа пользователя
    Если connectionStatus = 'connected' и есть user, то переходим на окно с компаниями
    Если connectionStatus = 'not-activated', то переходим на окно активации устройства
  */

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {connectionStatus === 'connected' ? (
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
      ) : connectionStatus === 'not-connected' ? (
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
