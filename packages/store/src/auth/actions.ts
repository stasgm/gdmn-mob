import { IApiConfig } from '@lib/client-types';
import { IDevice, IUser, ICompany } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IAuthState } from './types';

const init = createAction('AUTH/INIT')<IAuthState>();
export const setSettings = createAction('AUTH/SET_SETTINGS')<IApiConfig>();
export const setCompany = createAction('AUTH/SET_COMPANY')<ICompany | undefined>();
export const disconnect = createAction('AUTH/DISCONNECT')();
export const logout = createAction('AUTH/LOGOUT')(); // TODO Сделать sync c выходом пользователя на сервере

const checkDeviceAsync = createAsyncAction(
  'AUTH/CHECK_DEVICE',
  'AUTH/CHECK_DEVICE_SUCCCES',
  'AUTH/CHECK_DEVICE_FAILURE',
)<string | undefined, IDevice | null, string>();

const activateDeviceAsync = createAsyncAction(
  'AUTH/ACTIVATE_DEVICE',
  'AUTH/ACTIVATE_DEVICE_SUCCCES',
  'AUTH/ACTIVATE_DEVICE_FAILURE',
)<string | undefined, IDevice | null, string>();

const loginUserAsync = createAsyncAction('AUTH/LOGIN', 'AUTH/LOGIN_SUCCCES', 'AUTH/LOGIN_FAILURE')<
  string | undefined,
  IUser | null,
  string
>();

export const authActions = {
  init,
  setSettings,
  disconnect,
  logout,
  setCompany,
  checkDeviceAsync,
  loginUserAsync,
  activateDeviceAsync,
};

export type AuthActionType = ActionType<typeof authActions>;
