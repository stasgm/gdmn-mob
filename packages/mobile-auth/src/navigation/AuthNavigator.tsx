import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch, useDispatch, documentActions } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import { device as mockDevice, user as mockUser } from '@lib/mock';

import { Settings } from 'react-native';

import {
  SplashScreen,
  SignInScreen,
  ConfigScreen,
  ActivationScreen,
  AppLoadScreen,
  ModeSelectionScreen,
} from '../screens';

import { AuthStackParamList } from './types';
// import { useNavigation } from '@react-navigation/native';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { settings, user, connectionStatus } = useSelector((state) => state.auth);
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();

  useEffect(() => {
    //authDispatch(authActions.init());
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...settings };
    console.log('11111settings', settings);
    // // authDispatch(authActions.init());
    // console.log('init connectionStatus', connectionStatus);
    // if (connectionStatus === 'init') {
    //   return;
    // }
    // if (settings.debug?.isMock) {
    //   console.log('useEffect first demo');
    //   authDispatch(authActions.setConnectionStatus('init'));
    // } else if (connectionStatus !== 'not-connected') {
    //   console.log('useEffect first demo 2');
    //   authDispatch(authActions.setConnectionStatus('not-connected'));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // authDispatch(authActions.init());
  //   console.log('init connectionStatus', connectionStatus);
  //   if (connectionStatus === 'init') {
  //     return;
  //   }
  //   if (settings.debug?.isMock) {
  //     console.log('useEffect first demo');
  //     authDispatch(authActions.setConnectionStatus('init'));
  //   } else if (connectionStatus !== 'not-connected') {
  //     console.log('useEffect first demo 2');
  //     authDispatch(authActions.setConnectionStatus('not-connected'));
  //   }
  // }, []);

  // console.log('settings111', settings);

  const disconnect = useCallback(() => {
    authDispatch(authActions.disconnect());
  }, [authDispatch]);

  const saveSettings = useCallback(
    (newSettings: IApiConfig) => {
      if (newSettings.deviceId === '') {
        disconnect();
      }
      authDispatch(authActions.setSettings(newSettings));
      api.config = { ...newSettings };
      console.log('api.config', api.config);
    },
    [disconnect, authDispatch],
  );

  const checkDevice = useCallback(() => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе connectionStatus = 'not-activated', переходим на окно ввода кода
    // setConnectionMode(false);
    authDispatch(authActions.getDeviceStatus(settings?.deviceId));
    //Получим устройство по uid
    if (settings?.deviceId && user) {
      authDispatch(authActions.getDeviceByUid(settings.deviceId));
    }
  }, [authDispatch, settings?.deviceId, user]);

  const activateDevice = useCallback(
    async (code: string) => {
      const res = await authDispatch(authActions.activateDevice(code));
      if (res.type === 'AUTH/ACTIVATE_DEVICE_SUCCESS') {
        //Если устройство прошло активацию по коду,
        //то запишем uId в конфиг api и в настройки
        authDispatch(authActions.setSettings({ ...settings, deviceId: res.payload }));
        api.config.deviceId = res.payload;
      }
    },
    [authDispatch, settings],
  );

  const signIn = useCallback(
    async (credentials: IUserCredentials) => {
      const res = await authDispatch(authActions.signIn(credentials));
      if (settings?.deviceId && res.type === 'AUTH/LOGIN_SUCCESS') {
        authDispatch(authActions.getDeviceByUid(settings.deviceId));
      }
    },
    [authDispatch, settings.deviceId],
  );

  const logout = useCallback(async () => {
    console.log('logout', connectionStatus);
    authDispatch(authActions.logout());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
    // authDispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: false } }));
  }, [connectionStatus, authDispatch, settings]);

  const setCompany = useCallback((company: ICompany) => authDispatch(authActions.setCompany(company)), [authDispatch]);

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

  // const navigation = useNavigation();

  const onSetServerMode = useCallback(() => {
    disconnect();
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
    authDispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: false } }));
    dispatch(authActions.setConnectionStatus('not-connected'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, authDispatch]);

  const onSetDemoMode = useCallback(async () => {
    console.log('demo mode');
    dispatch(authActions.setDemoMode());
    // dispatch(authActions.setConnectionStatus('demo'));
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: true } : { isMock: true };
    // authDispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: true } }));
    // await signIn({ name: mockUser.name, password: mockUser.password || '' });
    // setCompany(mockUser.company as ICompany);
    // await authDispatch(authActions.getDeviceByUid(mockDevice.uid));
    // dispatch(documentActions.init());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authDispatch, setCompany, signIn]);

  const CongfigWithParams = useCallback(
    () => <ConfigScreen onSetSettings={saveSettings} onSetDemoMode={onSetDemoMode} settings={settings} />,
    [onSetDemoMode, saveSettings, settings],
  );

  const ModeSelection = useCallback(
    () => <ModeSelectionScreen onSetServerMode={onSetServerMode} onSetDemoMode={onSetDemoMode} />,
    [onSetServerMode, onSetDemoMode],
  );

  /*
    Если connectionStatus = 'not-connected', то переходим на окно с подключеним
    Если connectionStatus = 'connected' и user undefined то переходим на окно входа пользователя
    Если connectionStatus = 'connected' и есть user, то переходим на окно с компаниями
    Если connectionStatus = 'not-activated', то переходим на окно активации устройства
  */

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {connectionStatus === 'init' ? (
        <AuthStack.Screen
          name="Mode"
          component={ModeSelection}
          // options={{ animationTypeForReplace: user ? 'pop' : 'push' }}
        />
      ) : connectionStatus === 'connected' ? (
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
        // settings.deviceId
        //   ? (<AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />)
        //   : (<AuthStack.Screen name="Config" component={CongfigWithParams} />)
        settings.deviceId ? (
          <>
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
          </>
        ) : (
          <>
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
          </>
        )
      ) : (
        <AuthStack.Screen name="Activation" component={ActivateWithParams} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
