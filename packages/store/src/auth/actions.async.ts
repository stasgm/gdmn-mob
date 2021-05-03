import { ThunkAction } from 'redux-thunk';

import { IUserCredentials } from '@lib/types';
import api from '@lib/client-api';
import { config } from '@lib/client-config';

import { RootState } from '../..';

import { authActions, AuthActionType } from './actions';

const {
  debug: { deviceId },
  /*   server: { name, port, protocol },
    timeout,
    apiPath, */
} = config;

// const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

export type AppThunk = ThunkAction<Promise<AuthActionType>, RootState, null, AuthActionType>;

const checkDevice = (): AppThunk => {
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

const activateDevice = (code: string): AppThunk => {
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

const signUp = (userCredentials: IUserCredentials): AppThunk => {
  return async (dispatch) => {
    dispatch(authActions.signUpAsync.request(''));

    const response = await api.auth.signup(userCredentials);

    if (response.type === 'SIGNUP') {
      return dispatch(authActions.signUpAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(authActions.signUpAsync.failure(response.message));
    }

    return dispatch(authActions.signUpAsync.failure('something wrong'));
  };
};

const signIn = (credentials: IUserCredentials): AppThunk => {
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

const signInWithDevice = (credentials: IUserCredentials): AppThunk => {
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

export default { checkDevice, activateDevice, signUp, signIn, signInWithDevice };
