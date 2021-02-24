import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer, useCallback, useMemo } from 'react';

import { IResponse, IUser, IDevice, IBaseUrl } from '../../../common';
import { createCancellableSignal, appStorage, timeout } from '../helpers/utils';
import { IDataFetch } from '../model/types';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens/Auth';
import { useAuthStore, useServiceStore } from '../store';
import CompanyNavigator from './CompanyNavigator';

type AuthStackParamList = {
  Splash: undefined;
  Config: undefined;
  DeviceRegister: undefined;
  LogIn: undefined;
  SelectCompany: undefined;
  App: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

interface ILoadingState {
  serverResp?: IResponse<IDevice>;
  serverReq: IDataFetch;
  showSettings: boolean;
}

type Action =
  | { type: 'INIT' }
  | { type: 'SET_CONNECTION' }
  | { type: 'SET_ERROR'; text: string }
  | { type: 'SETTINGS_FORM'; showSettings: boolean }
  | { type: 'SET_RESPONSE'; result: boolean; data?: IDevice };

function reducer(state: ILoadingState, action: Action): ILoadingState {
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'SETTINGS_FORM':
      return {
        ...state,
        showSettings: action.showSettings,
        serverResp: undefined,
        serverReq: { isError: false, status: undefined, isLoading: false },
      };
    case 'SET_RESPONSE':
      return { ...state, serverResp: { result: action.result, data: action.data } };
    case 'SET_ERROR':
      return { ...state, serverReq: { isError: true, status: action.text, isLoading: false } };
    case 'SET_CONNECTION':
      return {
        ...state,
        serverResp: undefined,
        serverReq: { isError: false, status: undefined, isLoading: true },
      };
    default:
      return state;
  }
}

const initialState: ILoadingState = {
  serverResp: undefined,
  serverReq: { isLoading: false, isError: false, status: undefined },
  showSettings: false,
};

const isUser = (obj: unknown): obj is IUser => typeof obj === 'object' && 'id' in obj;

const AuthNavigator = () => {
  const {
    state: { deviceRegistered, userID, companyID },
    actions: authActions,
  } = useAuthStore();

  const {
    state: { serverUrl, isLoading: isAppDataLoading },
    actions,
    apiService,
  } = useServiceStore();

  const [state, setState] = useReducer(reducer, initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { signal, cancel } = useMemo(() => createCancellableSignal(), [state.serverReq.isLoading]);

  // LogBox.ignoreAllLogs(!config[0].debug.showWarnings);
  /*
    Порядок работы:
      1) Проверка регистрации устройства на сервере
        - если нет регистрации то переводим пользователя на ввод кода регистрации
        - если регистрация есть то проверяем статус пользователя
      2) Получение статуса пользователя на сервере
        - осуществлён ли вход текущего пользователя, если нет то перевод на вход пользователя
  */
  useEffect(() => {
    /* Нажата кнопка подключиться (или начальное состояние 'подключение')
      deviceRegistered ещё не определно и состояние isLoading = true
       => 1. Запрос к серверу devices/:id
    */
    const getDeviceStatus = async () => {
      try {
        // const response = await apiService.auth.getDevice();
        const response = await timeout<IResponse<IDevice>>(apiService.baseUrl.timeout, apiService.auth.getDevice());
        // const response: IResponse<IDevice> = await timeoutWithСancellation<IResponse<IDevice>>(
        //   signal,
        //   5000,
        //   apiService.auth.getDevice(),
        // );
        // // setState({ type: 'SET_RESPONSE', result: response.result, data: response.data });
        // authActions.setUserStatus({ userID: null, userName: undefined });
        if (!response.result) {
          // устройства нет на сервере, сбросим DeviceId на сутройстве
          actions.setDeviceId(null);
        }
        authActions.setDeviceStatus(response.result);
      } catch (err) {
        setState({ type: 'SET_ERROR', text: err.message });
      }
    };

    if (deviceRegistered === undefined && state.serverReq?.isLoading) {
      getDeviceStatus();
    }
  }, [actions, apiService.auth, apiService.baseUrl.timeout, authActions, deviceRegistered, signal, state.serverReq]);

  useEffect(() => {
    /* 2. Если устройства найдено (deviceRegistered = true)
      то делаем отправляем запрос на проверку пользователя (пользователь передаётся из куки)
    */
    const getUser = async () => {
      try {
        const result = await apiService.auth.getUserStatus();
        if (!result.result) {
          authActions.setUserStatus({ userID: null, userName: undefined });
          authActions.setCompanyID({ companyId: null, companyName: undefined });
          return;
        }
        if (!isUser(result.data)) {
          authActions.setUserStatus({ userID: null, userName: undefined });
          setState({ type: 'SET_ERROR', text: 'ошибка при получении пользователя' });
          return;
        }
        const user = result.data as IUser;

        authActions.setUserStatus({
          userID: user.id,
          userName: (user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.userName).trim(),
        });
      } catch (err) {
        setState({ type: 'SET_ERROR', text: err.message });
      }
    };

    if (deviceRegistered !== undefined) {
      if (deviceRegistered) {
        getUser();
      } else {
        authActions.setUserStatus({ userID: null, userName: undefined });
      }
    }
  }, [authActions, apiService.auth, deviceRegistered]);
  // Вынести всё в store  - deviceRegistered

  useEffect(() => {
    if (!userID) {
      /* При обнулении userID сбрасываем состояние состояния в навигаторе */
      setState({ type: 'INIT' });
    }
  }, [userID]);

  useEffect(() => {
    const getCompanyId = async () => {
      const savedCompany = await appStorage.getItem(`${userID}/companyId`);
      const response = await apiService.auth.getUserStatus();
      // authActions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });

      if (!!savedCompany && response.result && response.data?.companies?.some((company) => company === savedCompany)) {
        authActions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });
      } else {
        authActions.setCompanyID({ companyId: null, companyName: undefined });
      }
    };

    if (userID !== undefined) {
      if (userID) {
        getCompanyId();
      } else {
        authActions.setCompanyID({ companyId: null, companyName: '' });
      }
    }
  }, [apiService.auth, authActions, userID]);

  const connection = useCallback(() => setState({ type: 'SET_CONNECTION' }), []);

  const breakConnection = useCallback(() => cancel(), [cancel]);

  const showSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: true }), []);

  const hideSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: false }), []);

  const changeSettings = useCallback(
    (newServerUrl: IBaseUrl) => {
      actions.setServerUrl(newServerUrl);
      setState({ type: 'SETTINGS_FORM', showSettings: false });
    },
    [actions],
  );

  const SplashWithParams = useCallback(
    () => (
      <SplashScreen
        {...{ breakConnection, connection, deviceRegistered, userID, showSettings }}
        isLoading={state?.serverReq.isLoading}
        isError={state?.serverReq?.isError}
        status={state?.serverReq?.status}
        serverName={`${serverUrl?.server}:${serverUrl?.port}`}
      />
    ),
    [
      breakConnection,
      connection,
      deviceRegistered,
      userID,
      showSettings,
      state.serverReq.isLoading,
      state.serverReq.isError,
      state.serverReq.status,
      serverUrl.server,
      serverUrl.port,
    ],
  );

  const CongfigWithParams = useCallback(
    () => (
      <ConfigScreen
        {...{ hideSettings, changeSettings }}
        serverName={`${serverUrl?.protocol}${serverUrl?.server}`}
        serverPort={serverUrl?.port}
        timeout={serverUrl?.timeout}
      />
    ),
    [hideSettings, changeSettings, serverUrl.protocol, serverUrl.server, serverUrl.port, serverUrl.timeout],
  );

  const ConfigComponent = useMemo(
    () => (
      <Stack.Screen
        key="Config"
        name="Config"
        component={CongfigWithParams}
        options={{ headerShown: true, headerBackTitleVisible: true }}
      />
    ),
    [CongfigWithParams],
  );

  const LoginComponent = useMemo(() => {
    return userID ? (
      companyID ? (
        <Stack.Screen key="App" name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen key="SelectCompany" name="SelectCompany" component={CompanyNavigator} />
      )
    ) : (
      <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} />
    );
  }, [userID, companyID]);

  const RegisterComponent = useMemo(
    () =>
      !deviceRegistered ? (
        <Stack.Screen key="DeviceRegister" name="DeviceRegister" component={ActivationScreen} />
      ) : (
        LoginComponent
      ),
    [deviceRegistered, LoginComponent],
  );

  /* Еели deviceRegistered и userId не определены то отображаем страницу подключения */
  const AuthConfig = useMemo(() => {
    return !(deviceRegistered === undefined || userID === undefined || companyID === undefined) ? (
      RegisterComponent
    ) : (
      <Stack.Screen
        key="Splash"
        name="Splash"
        component={SplashWithParams}
        options={{ animationTypeForReplace: 'pop' }}
      />
    );
  }, [RegisterComponent, SplashWithParams, companyID, deviceRegistered, userID]);

  return <Stack.Navigator headerMode="none">{state.showSettings ? ConfigComponent : AuthConfig}</Stack.Navigator>;
};

export default AuthNavigator;
