import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch, useDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import { device as mockDevice, user as mockUser } from '@lib/mock';

import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen, AppLoadScreen, ModeSelectionScreen } from '../screens';

import { AuthStackParamList } from './types';
import { Settings } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { settings, user, connectionStatus } = useSelector((state) => state.auth);
  const dispatch = useAuthThunkDispatch();
  const authDispatch = useDispatch();

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
      console.log('api.config', api.config);
    },
    [disconnect, dispatch],
  );

  const checkDevice = useCallback(() => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе connectionStatus = 'not-activated', переходим на окно ввода кода
    // setConnectionMode(false);
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

  const logout = useCallback(async () => {
    console.log('logout', connectionStatus);
    dispatch(authActions.logout());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
    dispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: false } }));
  }, [authDispatch, connectionStatus, dispatch]);

  const setCompany = useCallback((company: ICompany) => dispatch(authActions.setCompany(company)), [dispatch]);

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
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
    dispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: false } }));
    disconnect();
    authDispatch(authActions.setConnectionStatus('not-connected'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, dispatch]);

  const onSetDemoMode = useCallback(async () => {
    console.log('demo mode');
    authDispatch(authActions.setConnectionStatus('demo'));
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: true } : { isMock: true };
    dispatch(authActions.setSettings({ ...settings, debug: { ...settings.debug, isMock: true } }));
    await signIn({ name: mockUser.name, password: mockUser.password || '' });
    setCompany(mockUser.company as ICompany);
    await dispatch(authActions.getDeviceByUid(mockDevice.uid));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authDispatch, dispatch, setCompany, signIn]);

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
      ) : connectionStatus === 'not-connected' ?
          // settings.deviceId
          //   ? (<AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />)
          //   : (<AuthStack.Screen name="Config" component={CongfigWithParams} />)
        settings.deviceId ?  (
          <>
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
          </>
        ) :
        (
          <>
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
          </>
        )
       : (
        <AuthStack.Screen name="Activation" component={ActivateWithParams} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
