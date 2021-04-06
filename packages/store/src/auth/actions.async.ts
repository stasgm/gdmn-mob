import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/types';

import { device, user } from '@lib/mock';

import { types, requests } from '@lib/client-api';

import { sleep } from '../utils/tools';

import { authActions } from './actions';
import { IAuthState } from './types';

const isMock = true; // TODO брать из конфига

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: types.device.IGetDeviceResponse | types.error.INetworkError;

    dispatch(authActions.checkDeviceAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { device: device, type: 'GET_DEVICE' };
      // response = { message: 'device not found', type: 'ERROR' };
    } else {
      response = await requests.device.getDevice(device.uid || '');
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
      response = await requests.auth.verifyCode(code);
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

      if (credentials.userName === 'Stas' && credentials.password === '123') {
        response = { type: 'LOGIN', user };
      } else {
        return dispatch(authActions.loginUserAsync.failure('не верные данные'));
      }
    } else {
      response = await requests.auth.login(credentials);
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

export default { checkDevice, activateDevice, signIn };
