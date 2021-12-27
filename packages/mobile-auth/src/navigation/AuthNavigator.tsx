import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch, useDispatch } from '@lib/store';
import { ICompany, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

import api from '@lib/client-api';

import {
  SplashScreen,
  SignInScreen,
  ConfigScreen,
  ActivationScreen,
  AppLoadScreen,
  ModeSelectionScreen,
} from '../screens';

import { AuthStackParamList } from './types';
import { Caption, useTheme } from 'react-native-paper';
import { globalStyles as styles, AppScreen } from '@lib/mobile-ui';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const config = useSelector((state) => state.auth.config);
  const isDemo = useSelector((state) => state.auth.isDemo);
  const user = useSelector((state) => state.auth.user);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  /*
    При запуске приложения
    - устанавливаем isInit, чтобы открылось окно выбора режима (демо или подключение к серверу).
      если устройство активировано (установлен deviceId) и не демо режим, то isInit = false
    - устанавливаем loading, чтобы окна не дергались при смене данных на useEffect
  */
  const [isInit, setInit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    let isMock = isDemo;
    if (connectionStatus === 'not-connected' && (!config.deviceId || isDemo)) {
      console.log('isInit 111', config.deviceId, connectionStatus);
      //Если загружается приложение в демо режиме, а перед этим не вышли из аккаунта
      //то выполняем disconnect, меняем признак демо режима в false
      if (isDemo && user) {
        disconnect();
        isMock = false;
      }
      setInit(true);
    } else {
      console.log('isInit 222', config.deviceId, connectionStatus);
      setInit(false);
    }
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config, debug: { ...api.config.debug, isMock } };

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = useCallback(async () => {
    await authDispatch(authActions.disconnect());
  }, [authDispatch]);

  const saveConfig = useCallback(
    (newConfig: IApiConfig) => {
      if (newConfig.deviceId === '') {
        disconnect();
      }
      authDispatch(authActions.setConfig(newConfig));
      api.config = { ...api.config, ...newConfig };
    },
    [disconnect, authDispatch],
  );

  const checkDevice = useCallback(async () => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе connectionStatus = 'not-activated', переходим на окно ввода кода
    await authDispatch(authActions.getDeviceStatus(config?.deviceId));
    //Получим устройство по uid
    if (config?.deviceId && user) {
      authDispatch(authActions.getDeviceByUid(config.deviceId));
    }
  }, [authDispatch, config?.deviceId, user]);

  const activateDevice = useCallback(
    async (code: string) => {
      const res = await authDispatch(authActions.activateDevice(code));
      if (res.type === 'AUTH/ACTIVATE_DEVICE_SUCCESS') {
        //Если устройство прошло активацию по коду,
        //то запишем uId в конфиг api и в настройки
        // authDispatch(authActions.setSettings({ ...config, deviceId: res.payload }));
        authDispatch(authActions.setConfig({ ...config, deviceId: res.payload }));
        api.config.deviceId = res.payload;
      }
    },
    [authDispatch, config],
  );

  const login = useCallback(
    async (credentials: IUserCredentials) => {
      const res = await authDispatch(authActions.login(credentials));
      if (config?.deviceId && res.type === 'AUTH/LOGIN_SUCCESS') {
        authDispatch(authActions.getDeviceByUid(config.deviceId));
      }
    },
    [authDispatch, config.deviceId],
  );

  const logout = useCallback(async () => {
    authDispatch(authActions.logout());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
  }, [authDispatch]);

  const setCompany = useCallback((company: ICompany) => authDispatch(authActions.setCompany(company)), [authDispatch]);

  const SplashWithParams = useCallback(
    () => <SplashScreen settings={config} onCheckDevice={checkDevice} />,
    [checkDevice, config],
  );

  const SignInWithParams = useCallback(
    () => <SignInScreen onDisconnect={disconnect} onSignIn={login} />,
    [login, disconnect],
  );

  const ActivateWithParams = useCallback(
    () => <ActivationScreen onDisconnect={disconnect} onActivate={activateDevice} />,
    [activateDevice, disconnect],
  );

  const AppLoadWithParams = useCallback(
    () => <AppLoadScreen onSetCompany={setCompany} company={user?.company} onLogout={logout} />,
    [logout, setCompany, user?.company],
  );

  const onSetServerMode = useCallback(async () => {
    await disconnect();
    setInit(false);
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, authDispatch]);

  const onSetDemoMode = useCallback(async () => {
    dispatch(authActions.setDemoMode());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: true } : { isMock: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authDispatch, setCompany, login]);

  const CongfigWithParams = useCallback(
    () => <ConfigScreen onSetSettings={saveConfig} onSetDemoMode={onSetDemoMode} settings={config} />,
    [onSetDemoMode, saveConfig, config],
  );

  const ModeSelection = useCallback(
    () => <ModeSelectionScreen onSetServerMode={onSetServerMode} onSetDemoMode={onSetDemoMode} />,
    [onSetServerMode, onSetDemoMode],
  );

  /*
    Если isInit, то переходим на окно выбора режима (демо или подключение к серверу)
    Если connectionStatus = 'not-connected', то переходим на окно с подключеним
    Если connectionStatus = 'connected' и user undefined то переходим на окно входа пользователя
    Если connectionStatus = 'connected' и есть user, то переходим на окно с компаниями
    Если connectionStatus = 'not-activated', то переходим на окно активации устройства
  */

  console.log('isInit', isInit);

  return !loading ? (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {isInit ? (
        <AuthStack.Screen name="Mode" component={ModeSelection} />
      ) : connectionStatus === 'connected' ? (
        !user ? (
          <AuthStack.Screen
            name="Login"
            component={SignInWithParams}
            options={{ animationTypeForReplace: 'push' }}
          />
        ) : (
          <AuthStack.Screen
            name="LoginCompany"
            component={AppLoadWithParams}
            options={{ animationTypeForReplace: 'pop' }}
          />
        )
      ) : connectionStatus === 'not-connected' ? (
        // settings.deviceId
        //   ? (<AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />)
        //   : (<AuthStack.Screen name="Config" component={CongfigWithParams} />)
        config.deviceId ? (
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
  ) : (<></>);
};

export default AuthNavigator;
