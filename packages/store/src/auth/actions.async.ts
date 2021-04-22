import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/types';

import { device, user } from '@lib/mock';

import Api, { types } from '@lib/client-api';

import { config } from '@lib/client-config';

import { sleep } from '../utils/tools';

import { authActions } from './actions';
import { IAuthState } from './types';

const {
  debug: { useMockup: isMock, deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: types.device.IGetDeviceResponse | types.error.INetworkError;

    dispatch(authActions.checkDeviceAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { device: device, type: 'GET_DEVICE' };
      // response = { message: 'device not found', type: 'ERROR' };
    } else {
      // response = await requests.device.getDevice(device.uid || '');
      response = await api.device.getDevice(deviceId);
    }

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
    let response: types.auth.IVerifyCodeResponse | types.error.INetworkError;

    dispatch(authActions.activateDeviceAsync.request(''));

    if (isMock) {
      await sleep(500);

      if (code === '1234') {
        response = { type: 'VERIFY_CODE', device };
      } else {
        return dispatch(authActions.activateDeviceAsync.failure('не верный код'));
      }
    } else {
      response = await api.auth.verifyCode(code);
    }

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
    let response: types.auth.ILoginResponse | types.error.INetworkError;

    dispatch(authActions.loginUserAsync.request(''));

    if (isMock) {
      await sleep(500);

      if (credentials.name === 'Stas' && credentials.password === '@123!') {
        response = { type: 'LOGIN', user };
      } else {
        return dispatch(authActions.loginUserAsync.failure('не верные данные'));
      }
    } else {
      response = await api.auth.login(credentials);
    }

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
    let responseDevice: types.device.IGetDeviceResponse | types.error.INetworkError;

    dispatch(authActions.checkDeviceAsync.request(''));

    if (isMock) {
      await sleep(500);

      responseDevice = { device: device, type: 'GET_DEVICE' };
    } else {
      responseDevice = await api.device.getDevice(deviceId);
    }

    if (responseDevice.type === 'GET_DEVICE') {
      dispatch(authActions.checkDeviceAsync.success(responseDevice.device));

      let responseLogin: types.auth.ILoginResponse | types.error.INetworkError;

      dispatch(authActions.loginUserAsync.request(''));

      if (isMock) {
        await sleep(500);

        if (credentials.name === 'Stas' && credentials.password === '@123!') {
          responseLogin = { type: 'LOGIN', user };
        } else {
          return dispatch(authActions.loginUserAsync.failure('не верные данные'));
        }
      } else {
        responseLogin = await api.auth.login(credentials);
      }

      if (responseLogin.type === 'LOGIN') {
        return dispatch(authActions.loginUserAsync.success(responseLogin.user));
      }

      if (responseLogin.type === 'ERROR') {
        return dispatch(authActions.loginUserAsync.failure(responseLogin.message));
      }

      return dispatch(authActions.loginUserAsync.failure('something wrong'));
      //return dispatch(authActions.checkDeviceAsync.success(response.device));
    }

    if (responseDevice.type === 'ERROR') {
      return dispatch(authActions.checkDeviceAsync.failure(responseDevice.message));
    }

    return dispatch(authActions.checkDeviceAsync.failure('something wrong'));
  };
};

export default { checkDevice, activateDevice, signIn, signInWithDevice };
