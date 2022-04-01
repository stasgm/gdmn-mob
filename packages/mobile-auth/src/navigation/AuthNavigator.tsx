import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { authActions, useSelector, useAuthThunkDispatch } from '@lib/store';
import { IUserCredentials } from '@lib/types';
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

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const config = useSelector((state) => state.auth.config);
  const isDemo = useSelector((state) => state.auth.isDemo);
  const isInit = useSelector((state) => state.auth.isInit);
  const user = useSelector((state) => state.auth.user);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);
  const authDispatch = useAuthThunkDispatch();

  /*
    При запуске приложения
    - устанавливаем isInit, чтобы открылось окно выбора режима (демо или подключение к серверу).
      если устройство активировано (установлен deviceId) и не демо режим, то isInit = false
    - устанавливаем loading, чтобы окна не дергались при смене данных на useEffect
  */

  useEffect(() => {
    // setInit(connectionStatus === 'not-connected' && (!config.deviceId || isDemo));
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config, debug: { ...api.config.debug, isMock: isDemo } };
  }, [config, isDemo]);

  const disconnect = useCallback(async () => {
    await authDispatch(authActions.disconnect());
  }, [authDispatch]);

  const saveConfig = useCallback(
    (newConfig: IApiConfig) => {
      if (newConfig.deviceId === '' && config.deviceId !== '') {
        disconnect();
      }
      authDispatch(authActions.setConfig(newConfig));
      api.config = { ...api.config, ...newConfig };
    },
    [config.deviceId, authDispatch, disconnect],
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

  const [companyLoading, setCompanyLoading] = useState<boolean>(false);

  const setCompany = useCallback(async () => {
    if (!user?.company) {
      return;
    }
    setCompanyLoading(true);
    const res = await authDispatch(authActions.getCompany(user.company.id));
    if (res.type === 'AUTH/GET_COMPANY_SUCCESS') {
      authDispatch(authActions.setCompany(res.payload));
    } else if (res.type === 'AUTH/GET_COMPANY_FAILURE') {
      setCompanyLoading(false);
    }
  }, [authDispatch, user?.company]);

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
    () => (
      <AppLoadScreen onSetCompany={setCompany} company={user?.company} onLogout={logout} loading={companyLoading} />
    ),
    [companyLoading, logout, setCompany, user?.company],
  );

  const onSetServerMode = useCallback(async () => {
    if (user) {
      await disconnect();
    }
    authDispatch(authActions.setInit(false));

    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
  }, [user, authDispatch, disconnect]);

  const onSetDemoMode = useCallback(async () => {
    await authDispatch(authActions.setDemoMode());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: true } : { isMock: true };
  }, [authDispatch]);

  const CongfigWithParams = useCallback(
    () => <ConfigScreen onSetConfig={saveConfig} onSetDemoMode={onSetDemoMode} config={config} />,
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

  return (
    <SafeAreaProvider>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        {isInit ? (
          <AuthStack.Screen name="Mode" component={ModeSelection} />
        ) : connectionStatus === 'connected' ? (
          !user ? (
            <AuthStack.Screen name="Login" component={SignInWithParams} options={{ animationTypeForReplace: 'pop' }} />
          ) : (
            <AuthStack.Screen
              name="LoginCompany"
              component={AppLoadWithParams}
              options={{ animationTypeForReplace: 'push' }}
            />
          )
        ) : connectionStatus === 'not-connected' ? (
          config.deviceId ? (
            <>
              <AuthStack.Screen
                name="Splash"
                component={SplashWithParams}
                options={{ animationTypeForReplace: 'pop' }}
              />
              <AuthStack.Screen name="Config" component={CongfigWithParams} />
            </>
          ) : (
            <>
              <AuthStack.Screen name="Config" component={CongfigWithParams} />
              <AuthStack.Screen
                name="Splash"
                component={SplashWithParams}
                options={{ animationTypeForReplace: 'pop' }}
              />
            </>
          )
        ) : (
          <AuthStack.Screen name="Activation" component={ActivateWithParams} />
        )}
      </AuthStack.Navigator>
    </SafeAreaProvider>
  );
};

export default AuthNavigator;
