import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch, useDispatch } from '@lib/store';
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
  const dispatch = useDispatch();

  /*
    При запуске приложения
    - устанавливаем isInit, чтобы открылось окно выбора режима (демо или подключение к серверу).
      если устройство активировано (установлен deviceId) и не демо режим, то isInit = false
    - устанавливаем loading, чтобы окна не дергались при смене данных на useEffect
  */
  // const [isInit, setInit] = useState(connectionStatus === 'not-connected' && (!config.deviceId || isDemo));

  // useEffect(() => {
  //   // const i = connectionStatus === 'not-connected' && (!config.deviceId || isDemo);
  //   // if (i !== isInit) {
  //   console.log('isInit', connectionStatus === 'not-connected' && (!config.deviceId || isDemo));
  //   authDispatch(authActions.setInit(connectionStatus === 'not-connected' && (!config.deviceId || isDemo)));
  //   // }
  // }, []);

  useEffect(() => {
    // setInit(connectionStatus === 'not-connected' && (!config.deviceId || isDemo));
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config, debug: { ...api.config.debug, isMock: isDemo } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, authDispatch]);

  const onSetDemoMode = useCallback(async () => {
    dispatch(authActions.setLoadingData(true));
    dispatch(authActions.setDemoMode());
    dispatch(authActions.setLoadingData(false));
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: true } : { isMock: true };
  }, [dispatch]);

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

  return (
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
