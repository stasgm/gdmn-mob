import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/types';
import Api from '@lib/client-api';
import { config } from '@lib/client-config';

import { authActions } from './actions';
import { IAuthState } from './types';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(authActions.checkDeviceAsync.request(''));

    const response = await api.device.getDevice(deviceId);

    if (response.type === 'GET_DEVICE') {
      return dispatch(authActions.checkDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(authActions.checkDeviceAsync.failure(response.message));
    }

    return dispatch(authActions.checkDeviceAsync.failure('something wrong'));
  };
};

const activateDevice = (code: string): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(authActions.activateDeviceAsync.request(''));

    const response = await api.auth.verifyCode(code);

    if (response.type === 'VERIFY_CODE') {
      return dispatch(authActions.activateDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(authActions.activateDeviceAsync.failure(response.message));
    }

    return dispatch(authActions.activateDeviceAsync.failure('something wrong'));
  };
};

const signIn = (credentials: IUserCredentials): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(authActions.loginUserAsync.request(''));

    const response = await api.auth.login(credentials);

    if (response.type === 'LOGIN') {
      return dispatch(authActions.loginUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(authActions.loginUserAsync.failure(response.message));
    }

    return dispatch(authActions.loginUserAsync.failure('something wrong'));
  };
};

const signInWithDevice = (credentials: IUserCredentials): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    //Если устройство найдено, то проверяем пользователя, иначе возвращаем ошибку устройства
    //Если пользователь найден, записываем в хранилище объект пользователя, иначе возвращаем ошибку идентификации
    dispatch(authActions.checkDeviceAsync.request(''));

    const responseDevice = await api.device.getDevice(deviceId);

    if (responseDevice.type === 'GET_DEVICE') {
      dispatch(authActions.checkDeviceAsync.success(responseDevice.device));

      dispatch(authActions.loginUserAsync.request(''));

      const responseLogin = await api.auth.login(credentials);

      if (responseLogin.type === 'LOGIN') {
        return dispatch(authActions.loginUserAsync.success(responseLogin.user));
      }

      if (responseLogin.type === 'ERROR') {
        return dispatch(authActions.loginUserAsync.failure(responseLogin.message));
      }

      return dispatch(authActions.loginUserAsync.failure('something wrong'));
    }

    if (responseDevice.type === 'ERROR') {
      return dispatch(authActions.checkDeviceAsync.failure(responseDevice.message));
    }

    return dispatch(authActions.checkDeviceAsync.failure('something wrong'));
  };
};

export default { checkDevice, activateDevice, signIn, signInWithDevice };
