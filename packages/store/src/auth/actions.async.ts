import { IUserCredentials } from '@lib/types';
import api from '@lib/client-api';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { AuthState } from './types';
import { actions } from './actions';

const checkDevice = (): AppThunk<
  Promise<ActionType<typeof actions.checkDeviceAsync>>,
  AuthState,
  ActionType<typeof actions.checkDeviceAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.checkDeviceAsync.request(''));

    const response = await api.device.getDevice();

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

const signUp = (
  userCredentials: IUserCredentials,
): AppThunk<Promise<ActionType<typeof actions.signUpAsync>>, AuthState, ActionType<typeof actions.signUpAsync>> => {
  return async (dispatch) => {
    dispatch(actions.signUpAsync.request(''));

    const response = await api.auth.signup(userCredentials);

    if (response.type === 'SIGNUP') {
      return dispatch(actions.signUpAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.signUpAsync.failure(response.message));
    }

    return dispatch(actions.signUpAsync.failure('something wrong'));
  };
};

const signIn = (
  credentials: IUserCredentials,
): AppThunk<
  Promise<ActionType<typeof actions.loginUserAsync>>,
  AuthState,
  ActionType<typeof actions.loginUserAsync /* | typeof actions.setCompany */>
> => {
  return async (dispatch) => {
    dispatch(actions.loginUserAsync.request(''));

    const response = await api.auth.login(credentials);

    if (response.type === 'LOGIN') {
      /*       // Если к пользователю привязана компания то сразу выполняем вход
            if (response.user.company?.id) {
              const companyResponse = await api.company.getCompany(response.user.company?.id);

              if (companyResponse.type === 'GET_COMPANY') {
                dispatch(actions.setCompany(companyResponse.company));
              }
            } */

      return dispatch(actions.loginUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.loginUserAsync.failure(response.message));
    }

    return dispatch(actions.loginUserAsync.failure('something wrong'));
  };
};

const signInWithDevice = (
  credentials: IUserCredentials,
): AppThunk<
  Promise<ActionType<typeof actions.loginUserAsync | typeof actions.checkDeviceAsync>>,
  AuthState,
  ActionType<typeof actions.loginUserAsync | typeof actions.checkDeviceAsync>
> => {
  return async (dispatch) => {
    //Если устройство найдено, то проверяем пользователя, иначе возвращаем ошибку устройства
    //Если пользователь найден, записываем в хранилище объект пользователя, иначе возвращаем ошибку идентификации
    dispatch(actions.checkDeviceAsync.request(''));

    const responseDevice = await api.device.getDevice();

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

const getDeviceStatus = (uid: string): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.getDeviceStatusAsync.request(uid));

    const response = await api.auth.getDeviceStatus(uid);

    if (response.type === 'GET_DEVICE_STATUS') {
      return dispatch(actions.getDeviceStatusAsync.success(response.status));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.activateDeviceAsync.failure(response.message));
    }

    return dispatch(actions.activateDeviceAsync.failure('something wrong'));
  };
};

export default { checkDevice, activateDevice, signUp, signIn, signInWithDevice, getDeviceStatus };
