import { IUserCredentials, IUserSettings } from '@lib/types';
import api from '@lib/client-api';

import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { UserAsyncStorage } from '../utils/userAsyncStore';

import { appActions } from '../app/actions';

import { AuthState } from './types';
import { actions, AuthActionType } from './actions';

export type AuthDispatch = ThunkDispatch<AuthState, any, AuthActionType>;

export const useAuthThunkDispatch = () => useDispatch<AuthDispatch>();

// const loadData = (): AppThunk<
//   Promise<ActionType<typeof actions.loadDataAsync>>,
//   AuthState,
//   ActionType<typeof actions.loadDataAsync>
// > => {
//   return async (dispatch, getState) => {
//     dispatch(actions.loadDataAsync.request());
//     try {
//       // const auth: AuthState = await appStorage.getItem('auth');
//       // console.log('loadData');
//       // const newState = await loadStateByKey('auth');
//       const newState = getState();
//       return dispatch(actions.loadDataAsync.success(newState));
//     } catch {
//       return dispatch(actions.loadDataAsync.failure('Ошибка загрузки данных из json'));
//     }
//   };
// };

const getDeviceByUid = (
  uid: string,
): AppThunk<
  Promise<ActionType<typeof actions.getDeviceByUidAsync>>,
  AuthState,
  ActionType<typeof actions.getDeviceByUidAsync> | ActionType<typeof appActions.loadSuperDataFromDisc>
> => {
  return async (dispatch) => {
    dispatch(actions.getDeviceByUidAsync.request(''));

    const response = await api.device.getDevices({ uid });

    if (response.type === 'GET_DEVICES') {
      dispatch(appActions.loadSuperDataFromDisc());
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

const signup = (
  userCredentials: IUserCredentials,
): AppThunk<Promise<ActionType<typeof actions.signupAsync>>, AuthState, ActionType<typeof actions.signupAsync>> => {
  return async (dispatch) => {
    dispatch(actions.signupAsync.request(''));

    const response = await api.auth.signup(userCredentials);

    if (response.type === 'SIGNUP') {
      return dispatch(actions.signupAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.signupAsync.failure(response.message));
    }

    return dispatch(actions.signupAsync.failure('something wrong'));
  };
};

const login = (
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
      // const newState = getState();
      // dispatch(actions.loadData(newState));
      return dispatch(actions.loginUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.loginUserAsync.failure(response.message));
    }

    return dispatch(actions.loginUserAsync.failure('something wrong'));
  };
};

const disconnect = (): AppThunk<
  Promise<ActionType<typeof actions.disconnectAsync>>,
  AuthState,
  ActionType<typeof actions.disconnectAsync> | ActionType<typeof actions.setConnectionStatus>
> => {
  return async (dispatch) => {
    dispatch(actions.disconnectAsync.request());

    try {
      // dispatch(actions.setConnectionStatus('not-connected'));
      UserAsyncStorage.setUserId('');
      return dispatch(actions.disconnectAsync.success());
    } catch {
      return dispatch(actions.disconnectAsync.failure('Ошибка выхода'));
    }
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
      UserAsyncStorage.setUserId('');
      dispatch(actions.setConnectionStatus(api.config.deviceId ? 'connected' : 'not-connected'));
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

const setDemoMode = (): AppThunk<
  Promise<ActionType<typeof actions.setDemoModeAsync>>,
  AuthState,
  ActionType<typeof actions.setDemoModeAsync> | ActionType<typeof appActions.loadSuperDataFromDisc>
> => {
  return async (dispatch) => {
    dispatch(actions.setDemoModeAsync.request(''));

    try {
      dispatch(appActions.loadSuperDataFromDisc());
      return dispatch(actions.setDemoModeAsync.success());
    } catch {
      return dispatch(actions.setDemoModeAsync.failure('Ошибка установки демо режима'));
    }
  };
};

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
  signup,
  login,
  logout,
  disconnect,
  getDeviceStatus,
  useAuthThunkDispatch,
  setUserSettings,
  getCompany,
  setDemoMode,
};
