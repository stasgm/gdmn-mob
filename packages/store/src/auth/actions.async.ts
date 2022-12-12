import api, { CustomRequest } from '@lib/client-api';
import { IUserCredentials, IUserSettings } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { appActions } from '../app/actions';

import { AuthState } from './types';
import { actions, AuthActionType } from './actions';

export type AuthDispatch = ThunkDispatch<AuthState, any, AuthActionType>;

export const useAuthThunkDispatch = () => useDispatch<AuthDispatch>();

const getDeviceByUid = (
  customRequest: CustomRequest,
  uid: string,
  erpUserId?: string,
  appSystemName?: string,
): AppThunk<
  Promise<ActionType<typeof actions.getDeviceByUidAsync>>,
  AuthState,
  ActionType<typeof actions.getDeviceByUidAsync> | ActionType<typeof actions.setAppSystem>
> => {
  return async (dispatch) => {
    dispatch(actions.getDeviceByUidAsync.request(''));

    const response = await api.device.getDevices(customRequest, { uid });

    if (response.type === 'GET_DEVICES') {
      //Проверка на совпадение подсистемы приложения с подсистемой пользователя
      if (erpUserId && appSystemName) {
        const getErpUser = await api.user.getUser(customRequest, erpUserId);
        if (getErpUser.type !== 'GET_USER') {
          return dispatch(
            actions.getDeviceByUidAsync.failure(
              'Ошибка получения устройства по UId: невозможно получить данные о пользователе',
            ),
          );
        }
        if (appSystemName !== getErpUser.user.appSystem?.name) {
          return dispatch(
            actions.getDeviceByUidAsync.failure(
              'Ошибка получения устройства по UId: подсистема пользователя не совпадает с подсистемой приложения',
            ),
          );
        }
        //Записываем наименование подсистемы в хранилище
        dispatch(actions.setAppSystem(getErpUser.user.appSystem));
      }

      return dispatch(actions.getDeviceByUidAsync.success(response.devices[0]));
    }

    return dispatch(actions.getDeviceByUidAsync.failure(response.message));
  };
};

const activateDevice = (
  customRequest: CustomRequest,
  code: string,
): AppThunk<
  Promise<ActionType<typeof actions.activateDeviceAsync>>,
  AuthState,
  ActionType<typeof actions.activateDeviceAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.activateDeviceAsync.request(''));

    const response = await api.auth.verifyCode(customRequest, code);

    if (response.type === 'VERIFY_CODE') {
      return dispatch(actions.activateDeviceAsync.success(response.uid));
    }

    return dispatch(actions.activateDeviceAsync.failure(response.message));
  };
};

const signup = (
  customRequest: CustomRequest,
  userCredentials: IUserCredentials,
): AppThunk<Promise<ActionType<typeof actions.signupAsync>>, AuthState, ActionType<typeof actions.signupAsync>> => {
  return async (dispatch) => {
    dispatch(actions.signupAsync.request(''));

    const response = await api.auth.signup(customRequest, userCredentials);

    if (response.type === 'SIGNUP') {
      return dispatch(actions.signupAsync.success());
    }

    return dispatch(actions.signupAsync.failure(response.message));
  };
};

const login = (
  customRequest: CustomRequest,
  credentials: IUserCredentials,
  appSystemName?: string,
): AppThunk<
  Promise<ActionType<typeof actions.loginUserAsync>>,
  AuthState,
  ActionType<typeof actions.loginUserAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.loginUserAsync.request(''));

    const response = await api.auth.login(customRequest, credentials);

    if (response.type === 'LOGIN') {
      //Проверка на совпадение подсистемы приложения с подсистемой пользователя
      if (response.user.erpUser?.id && appSystemName) {
        const getErpUser = await api.user.getUser(customRequest, response.user.erpUser?.id);
        if (getErpUser.type !== 'GET_USER') {
          return dispatch(actions.loginUserAsync.failure('Невозможно получить данные об ERP-пользователе'));
        }
        if (appSystemName !== getErpUser.user.appSystem?.name) {
          return dispatch(
            actions.loginUserAsync.failure('Подсистема пользователя не совпадает с подсистемой приложения'),
          );
        }
      }
      return dispatch(actions.loginUserAsync.success(response.user));
    }

    return dispatch(actions.loginUserAsync.failure(response.message));
  };
};

const disconnect = (): AppThunk<
  Promise<ActionType<typeof actions.disconnectAsync>>,
  AuthState,
  ActionType<typeof actions.disconnectAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.disconnectAsync.request());
    try {
      return dispatch(actions.disconnectAsync.success());
    } catch {
      return dispatch(actions.disconnectAsync.failure('Ошибка выхода'));
    }
  };
};

const logout = (
  customRequest?: CustomRequest,
): AppThunk<
  Promise<ActionType<typeof actions.logoutUserAsync>>,
  AuthState,
  ActionType<typeof actions.logoutUserAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.logoutUserAsync.request());

    if (customRequest) {
      const response = await api.auth.logout(customRequest);

      if (response.type === 'LOGOUT') {
        return dispatch(actions.logoutUserAsync.success());
      }

      return dispatch(actions.logoutUserAsync.failure(response.message));
    } else {
      return dispatch(actions.logoutUserAsync.success());
    }
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

const getDeviceStatus = (
  customRequest: CustomRequest,
  uid?: string,
): AppThunk<
  Promise<ActionType<typeof actions.getDeviceStatusAsync>>,
  AuthState,
  ActionType<typeof actions.getDeviceStatusAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.getDeviceStatusAsync.request('Получение статуса устройства'));

    if (uid) {
      const response = await api.auth.getDeviceStatus(customRequest, uid);

      if (response.type === 'GET_DEVICE_STATUS') {
        return dispatch(
          actions.getDeviceStatusAsync.success(response.status === 'ACTIVE' ? 'connected' : 'not-activated'),
        );
      } else if (response.type === 'CONNECT_ERROR') {
        return dispatch(actions.getDeviceStatusAsync.success('not-checked'));
      }

      return dispatch(actions.getDeviceStatusAsync.failure(response.message));
    } else {
      return dispatch(actions.getDeviceStatusAsync.success('not-activated'));
    }
  };
};

const getCompany = (
  customRequest: CustomRequest,
  companyId: string,
): AppThunk<
  Promise<ActionType<typeof actions.getCompanyAsync>>,
  AuthState,
  ActionType<typeof actions.getCompanyAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.getCompanyAsync.request('Получение компании'));

    const response = await api.company.getCompany(customRequest, companyId);

    if (response.type === 'GET_COMPANY') {
      return dispatch(actions.getCompanyAsync.success(response.company));
    }

    return dispatch(actions.getCompanyAsync.failure(response.message));
  };
};

const setDemoMode = (): AppThunk<
  Promise<ActionType<typeof actions.setDemoModeAsync>>,
  AuthState,
  ActionType<typeof actions.setDemoModeAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setDemoModeAsync.request(''));

    try {
      return dispatch(actions.setDemoModeAsync.success());
    } catch {
      return dispatch(actions.setDemoModeAsync.failure('Ошибка установки демо режима'));
    }
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
