import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { authActions, useSelector, useAuthThunkDispatch } from '@lib/store';
import { AuthLogOut, IUserCredentials } from '@lib/types';
import { IApiConfig } from '@lib/client-types';
import api from '@lib/client-api';
import Constants from 'expo-constants';

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
  const { config, isDemo, isInit, user, isConfigFirst, connectionStatus, isLogout } = useSelector(
    (state) => state.auth,
  );

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
      authDispatch(authActions.setIsConfigFirst(false));
      api.config = { ...api.config, ...newConfig };
    },
    [config.deviceId, authDispatch, disconnect],
  );

  const logout = useCallback(async () => {
    await authDispatch(authActions.logout());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
  }, [authDispatch]);

  const authMiddleware: AuthLogOut = useCallback(() => authDispatch(authActions.logout()), [authDispatch]);

  const checkDevice = useCallback(async () => {
    //Если в настройках записан deviceId, то получаем от сервера устройство,
    //иначе connectionStatus = 'not-activated', переходим на окно ввода кода
    if (isLogout && config?.deviceId && user) {
      logout();
    } else {
      const objGetStatus = await authDispatch(authActions.getDeviceStatus(config?.deviceId));
      //TODO: надо обработать случай, если пришла ошибка, что не нашлось устройство по uid
      // if (objGetStatus.type === 'AUTH/GET_DEVICE_STATUS_FAILURE') {
      //   authDispatch(authActions.setConfig({ ...config, deviceId: undefined }));
      //   api.config = { ...api.config, deviceId: undefined };
      //   return;
      // }
      //Получим устройство по uid
      if (config?.deviceId && user && objGetStatus.type !== 'AUTH/GET_DEVICE_STATUS_FAILURE') {
        await authDispatch(
          authActions.getDeviceByUid(
            config.deviceId,
            user.erpUser!.id,
            Constants.manifest?.extra?.slug,
            authMiddleware,
          ),
        );
      }
    }
  }, [authDispatch, authMiddleware, config.deviceId, isLogout, logout, user]);

  const activateDevice = useCallback(
    async (code: string) => {
      const res = await authDispatch(authActions.activateDevice(code));
      if (res.type === 'AUTH/ACTIVATE_DEVICE_SUCCESS') {
        //Если устройство прошло активацию по коду,
        //то запишем uId в конфиг api и в настройки
        authDispatch(authActions.setConfig({ ...config, deviceId: res.payload }));
        api.config.deviceId = res.payload;
      }
    },
    [authDispatch, config],
  );

  const login = useCallback(
    async (credentials: IUserCredentials) => {
      const res = await authDispatch(authActions.login(credentials, Constants.manifest?.extra?.slug, authMiddleware));
      if (config?.deviceId && res.type === 'AUTH/LOGIN_SUCCESS') {
        await authDispatch(
          authActions.getDeviceByUid(
            config.deviceId,
            res.payload?.erpUser?.id,
            Constants.manifest?.extra?.slug,
            logout,
          ),
        );
      }
    },
    [authDispatch, authMiddleware, config.deviceId, logout],
  );

  const setCompany = useCallback(async () => {
    if (!user?.company) {
      return;
    }
    const res = await authDispatch(authActions.getCompany(user.company.id));
    if (res.type === 'AUTH/GET_COMPANY_SUCCESS') {
      authDispatch(authActions.setCompany(res.payload));
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
    () => <AppLoadScreen onSetCompany={setCompany} company={user?.company} onLogout={logout} />,
    [logout, setCompany, user?.company],
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
        isConfigFirst ? (
          <>
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
          </>
        ) : (
          <>
            <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
            <AuthStack.Screen name="Config" component={CongfigWithParams} />
          </>
        )
      ) : (
        <AuthStack.Screen name="Activation" component={ActivateWithParams} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
