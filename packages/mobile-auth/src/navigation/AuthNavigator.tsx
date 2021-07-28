import React, { useCallback, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useDispatch, useThunkDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen, AppLoadScreen } from '../screens';

import { AuthStackParamList } from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { settings, user } = useSelector((state) => state.auth);
  const dispatch = useThunkDispatch();
  const [deviceActivated, setDeviceActivated] = useState<undefined | boolean>(undefined);

  // console.log('deviceeee', device);
  // console.log('deviceId', deviceId);
  // console.log('user', user);
  // console.log('settings?.deviceId', settings?.deviceId);
  // console.log('api.config', api.config);
  // console.log('deviceStatus', deviceStatus);

  // useEffect(() => {
  //   //При измении настроек подключения в хранилище записываем их в апи
  //   api.config = { ...api.config, ...settings };
  // }, [settings]);

  // useEffect(() => {
  //   //При измении устройства записываем его uid в deviceId
  //   setDeviceId(device?.uid);
  // }, [device?.uid]);

  // useEffect(() => {
  //   if (device?.uid) {
  //     //При изменении устройства, запишем ид в настройки
  //     dispatch(authActions.setSettings({ ...settings, deviceId: device?.uid } as IApiConfig));
  //     //dispatch(authActions.getDeviceStatus(device?.uid));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [device?.uid, dispatch]);

  // useEffect(() => {
  //   if (device?.state === 'NON-ACTIVATED' && !deviceId) {
  //     setDeviceId(null);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [device?.state, dispatch]);

  const saveSettings = useCallback(
    (newSettings: IApiConfig) => {
      dispatch(authActions.setSettings(newSettings));
      api.config = { ...api.config, ...newSettings };
    },
    [dispatch],
  );

  const checkDevice = useCallback(async () => {
    //Если в настройках записан deviceId, то получаем от сервера устройство, иначе переходим на окно ввода кода (deviceId = null)
    if (settings?.deviceId) {
      const res = await dispatch(authActions.getDeviceStatus(settings?.deviceId));
      setDeviceActivated(res.type === 'AUTH/GET_DEVICE_STATUS_SUCCESS');
    } else {
      setDeviceActivated(false);
    }
  }, [dispatch, settings?.deviceId]);

  const activateDevice = useCallback(
    (code: string) => {
      dispatch(authActions.activateDevice(code));
      setDeviceActivated(true);
    },
    [dispatch],
  );

  const disconnect = useCallback(() => {
    dispatch(authActions.disconnect());
    setDeviceActivated(undefined);
  }, [dispatch]);

  const signIn = useCallback(
    (credentials: IUserCredentials) => {
      dispatch(authActions.signIn(credentials));
      //dispatch(authActions.signIn(credentials));
    },
    [dispatch],
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
    Если device undefined то переходим на окно с подключеним
    Если device null то переходим на окно активации устройства
    Если device не null и user undefined то переходим на окно входа пользователя
  */

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {deviceActivated ? (
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
      ) : deviceActivated === undefined ? (
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
