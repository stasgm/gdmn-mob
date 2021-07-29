import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useThunkDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen, AppLoadScreen } from '../screens';

import { AuthStackParamList } from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { settings, user, deviceStatus } = useSelector((state) => state.auth);
  const dispatch = useThunkDispatch();

  useEffect(() => {
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...settings };
  }, []);

  const saveSettings = useCallback(
    (newSettings: IApiConfig) => {
      dispatch(authActions.setSettings(newSettings));
      api.config = { ...api.config, ...newSettings };
    },
    [dispatch],
  );

  const checkDevice = useCallback(() => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе deviceStatus = 'not-activated', переходим на окно ввода кода
    dispatch(authActions.getDeviceStatus(settings?.deviceId));
    //Получим устройство по uid
    if (settings?.deviceId) {
      dispatch(authActions.getDeviceByUid(settings.deviceId));
    }
  }, [dispatch, settings?.deviceId]);

  const activateDevice = useCallback(
    async (code: string) => {
      const res = await dispatch(authActions.activateDevice(code));
      if (res.type === 'AUTH/ACTIVATE_DEVICE_SUCCESS') {
        //Если устройство прошло активацию по коду,
        //то запишем uId в конфиг api и в настройки
        dispatch(authActions.setSettings({ ...settings, deviceId: res.payload }));
        api.config.deviceId = res.payload;
        dispatch(authActions.getDeviceByUid(res.payload));
      }
    },
    [dispatch, settings],
  );

  const disconnect = useCallback(() => {
    dispatch(authActions.disconnect());
  }, [dispatch]);

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
    Если deviceStatus = 'init', то переходим на окно с подключеним
    Если deviceStatus = 'active' и user undefined то переходим на окно входа пользователя
    Если deviceStatus = 'active' и есть user, то переходим на окно с компаниями
    Если deviceStatus = 'not-activated', то переходим на окно активации устройства
  */

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {deviceStatus === 'active' ? (
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
      ) : deviceStatus === 'init' ? (
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
