import { IUserCredentials, IUserSettings } from '@lib/types';
import api from '@lib/client-api';

import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { AuthState } from './types';
import { actions, AuthActionType } from './actions';

export type AuthDispatch = ThunkDispatch<AuthState, any, AuthActionType>;

export const useAuthThunkDispatch = () => useDispatch<AuthDispatch>();

// const checkDevice = (): AppThunk<
//   Promise<ActionType<typeof actions.checkDeviceAsync>>,
//   AuthState,
//   ActionType<typeof actions.checkDeviceAsync>
// > => {
//   return async (dispatch) => {
//     dispatch(actions.checkDeviceAsync.request(''));

//     const response = await api.device.getDevice();

//     if (response.type === 'GET_DEVICE') {
//       return dispatch(actions.checkDeviceAsync.success(response.device));
//     }

//     if (response.type === 'ERROR') {
//       return dispatch(actions.checkDeviceAsync.failure(response.message));
//     }

//     return dispatch(actions.checkDeviceAsync.failure('something wrong'));
//   };
// };

const getDeviceByUid = (
  uid: string,
): AppThunk<
  Promise<ActionType<typeof actions.getDeviceByUidAsync>>,
  AuthState,
  ActionType<typeof actions.getDeviceByUidAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.getDeviceByUidAsync.request(''));

    const response = await api.device.getDevices({ uid });

    if (response.type === 'GET_DEVICES') {
      return dispatch(actions.getDeviceByUidAsync.success(response.devices[0]));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.getDeviceByUidAsync.failure(response.message));
    }

    return dispatch(actions.getDeviceByUidAsync.failure('something wrong'));
  };
};

const activateDevice = (
  code: string,
): AppThunk<
  Promise<ActionType<typeof actions.activateDeviceAsync>>,
  AuthState,
  ActionType<typeof actions.activateDeviceAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.activateDeviceAsync.request(''));

    const response = await api.auth.verifyCode(code);

    if (response.type === 'VERIFY_CODE') {
      return dispatch(actions.activateDeviceAsync.success(response.uid));
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
  ActionType<typeof actions.loginUserAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.loginUserAsync.request(''));

    const response = await api.auth.login(credentials);

    if (response.type === 'LOGIN') {
      // UserAsyncStorage.setUserId('5ae8c930-0584-11ec-991a-779431d580c9');
      return dispatch(actions.loginUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.loginUserAsync.failure(response.message));
    }

    return dispatch(actions.loginUserAsync.failure('something wrong'));
  };
};

const logout = (): AppThunk<
  Promise<ActionType<typeof actions.logoutUserAsync>>,
  AuthState,
  ActionType<typeof actions.logoutUserAsync> | ActionType<typeof actions.setConnectionStatus>
> => {
  return async (dispatch) => {
    dispatch(actions.logoutUserAsync.request());

    const response = await api.auth.logout();

    if (response.type === 'LOGOUT') {
      return dispatch(actions.logoutUserAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.logoutUserAsync.failure(response.message));
    }

    return dispatch(actions.logoutUserAsync.failure('Ошибка выхода из учетной записи'));
  };
};

const setUserSettings = (
  settings: IUserSettings,
): AppThunk<
  Promise<ActionType<typeof actions.setUserSettingsAsync>>,
  AuthState,
  ActionType<typeof actions.setUserSettingsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setUserSettingsAsync.request(''));

    try {
      return dispatch(actions.setUserSettingsAsync.success(settings));
    } catch {
      return dispatch(actions.setUserSettingsAsync.failure('Ошибка записи настроек пользователя'));
    }
  };
};

// const signInWithDevice = (
//   credentials: IUserCredentials,
// ): AppThunk<
//   Promise<ActionType<typeof actions.loginUserAsync | typeof actions.checkDeviceAsync>>,
//   AuthState,
//   ActionType<typeof actions.loginUserAsync | typeof actions.checkDeviceAsync>
// > => {
//   return async (dispatch) => {
//     //Если устройство найдено, то проверяем пользователя, иначе возвращаем ошибку устройства
//     //Если пользователь найден, записываем в хранилище объект пользователя, иначе возвращаем ошибку идентификации
//     dispatch(actions.checkDeviceAsync.request(''));

//     const responseDevice = await api.device.getDevice();

//     if (responseDevice.type === 'GET_DEVICE') {
//       dispatch(actions.checkDeviceAsync.success(responseDevice.device));

//       dispatch(actions.loginUserAsync.request(''));

//       const responseLogin = await api.auth.login(credentials);

//       if (responseLogin.type === 'LOGIN') {
//         return dispatch(actions.loginUserAsync.success(responseLogin.user));
//       }

//       if (responseLogin.type === 'ERROR') {
//         return dispatch(actions.loginUserAsync.failure(responseLogin.message));
//       }

//       return dispatch(actions.loginUserAsync.failure('something wrong'));
//     }

//     if (responseDevice.type === 'ERROR') {
//       return dispatch(actions.checkDeviceAsync.failure(responseDevice.message));
//     }

//     return dispatch(actions.checkDeviceAsync.failure('something wrong'));
//   };
// };

const getDeviceStatus = (
  uid?: string,
): AppThunk<
  Promise<ActionType<typeof actions.getDeviceStatusAsync>>,
  AuthState,
  ActionType<typeof actions.getDeviceStatusAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.getDeviceStatusAsync.request('Получение статуса устройства'));

    if (uid) {
      const response = await api.auth.getDeviceStatus(uid);

      if (response.type === 'GET_DEVICE_STATUS') {
        return dispatch(actions.getDeviceStatusAsync.success(response.status));
      }

      if (response.type === 'ERROR') {
        return dispatch(actions.getDeviceStatusAsync.failure(response.message));
      }
    } else {
      return dispatch(actions.getDeviceStatusAsync.success('NON-ACTIVATED'));
    }

    return dispatch(actions.getDeviceStatusAsync.failure('Ошибка получения статуса устройства'));
  };
};

const getCompany = (
  companyId: string,
): AppThunk<
  Promise<ActionType<typeof actions.getCompanyAsync>>,
  AuthState,
  ActionType<typeof actions.getCompanyAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.getCompanyAsync.request('Получение компании'));

    const response = await api.company.getCompany(companyId);

    if (response.type === 'GET_COMPANY') {
      return dispatch(actions.getCompanyAsync.success(response.company));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.getCompanyAsync.failure(response.message));
    }

    return dispatch(actions.getCompanyAsync.failure('Ошибка получения компании'));
  };
};

export default {
  getDeviceByUid,
  activateDevice,
  signUp,
  signIn,
  logout,
  getDeviceStatus,
  useAuthThunkDispatch,
  setUserSettings,
  getCompany,
};
