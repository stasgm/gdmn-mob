import { ThunkAction } from 'redux-thunk';

import { IUserCredentials } from '@lib/types';
import api from '@lib/client-api';
import { config } from '@lib/client-config';

import { AuthState } from './types';

import { actions, AuthActionType } from './actions';

const {
  debug: { deviceId },
  /*   server: { name, port, protocol },
    timeout,
    apiPath, */
} = config;

// const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

export type AppThunk = ThunkAction<Promise<AuthActionType>, AuthState, null, AuthActionType>;

const checkDevice = (): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.checkDeviceAsync.request(''));

    const response = await api.device.getDevice(deviceId);

    if (response.type === 'GET_DEVICE') {
      return dispatch(actions.checkDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.checkDeviceAsync.failure(response.message));
    }

    return dispatch(actions.checkDeviceAsync.failure('something wrong'));
  };
};

const activateDevice = (code: string): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.activateDeviceAsync.request(''));

    const response = await api.auth.verifyCode(code);

    if (response.type === 'VERIFY_CODE') {
      return dispatch(actions.activateDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.activateDeviceAsync.failure(response.message));
    }

    return dispatch(actions.activateDeviceAsync.failure('something wrong'));
  };
};

const signUp = (userCredentials: IUserCredentials): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.signUpAsync.request(''));

    const response = await api.auth.signup(userCredentials);

    if (response.type === 'SIGNUP') {
      return dispatch(actions.signUpAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.signUpAsync.failure(response.message));
    }

    return dispatch(actions.signUpAsync.failure('something wrong'));
  };
};

const signIn = (credentials: IUserCredentials): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.loginUserAsync.request(''));

    const response = await api.auth.login(credentials);

    if (response.type === 'LOGIN') {
      return dispatch(actions.loginUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.loginUserAsync.failure(response.message));
    }

    return dispatch(actions.loginUserAsync.failure('something wrong'));
  };
};

const signInWithDevice = (credentials: IUserCredentials): AppThunk => {
  return async (dispatch) => {
    //Если устройство найдено, то проверяем пользователя, иначе возвращаем ошибку устройства
    //Если пользователь найден, записываем в хранилище объект пользователя, иначе возвращаем ошибку идентификации
    dispatch(actions.checkDeviceAsync.request(''));

    const responseDevice = await api.device.getDevice(deviceId);

    if (responseDevice.type === 'GET_DEVICE') {
      dispatch(actions.checkDeviceAsync.success(responseDevice.device));

      dispatch(actions.loginUserAsync.request(''));

      const responseLogin = await api.auth.login(credentials);

      if (responseLogin.type === 'LOGIN') {
        return dispatch(actions.loginUserAsync.success(responseLogin.user));
      }

      if (responseLogin.type === 'ERROR') {
        return dispatch(actions.loginUserAsync.failure(responseLogin.message));
      }

      return dispatch(actions.loginUserAsync.failure('something wrong'));
    }

    if (responseDevice.type === 'ERROR') {
      return dispatch(actions.checkDeviceAsync.failure(responseDevice.message));
    }

    return dispatch(actions.checkDeviceAsync.failure('something wrong'));
  };
};

export default { checkDevice, activateDevice, signUp, signIn, signInWithDevice };
