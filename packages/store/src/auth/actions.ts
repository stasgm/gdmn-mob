import { IApiConfig } from '@lib/client-types';
import { IDevice, IUser, ICompany, DeviceState } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AuthState } from './types';

const init = createAction('AUTH/INIT')<AuthState>();
const clearError = createAction('AUTH/CLEAR_ERROR')();

const setSettings = createAction('AUTH/SET_SETTINGS')<IApiConfig>();
const setCompany = createAction('AUTH/SET_COMPANY')<ICompany | undefined>();
const disconnect = createAction('AUTH/DISCONNECT')();
const logout = createAction('AUTH/LOGOUT')(); // TODO Сделать sync c выходом пользователя на сервере

const checkDeviceAsync = createAsyncAction(
  'AUTH/CHECK_DEVICE',
  'AUTH/CHECK_DEVICE_SUCCESS',
  'AUTH/CHECK_DEVICE_FAILURE',
)<string | undefined, IDevice | null, string>();

const activateDeviceAsync = createAsyncAction(
  'AUTH/ACTIVATE_DEVICE',
  'AUTH/ACTIVATE_DEVICE_SUCCESS',
  'AUTH/ACTIVATE_DEVICE_FAILURE',
)<string | undefined, IDevice | null, string>();

const loginUserAsync = createAsyncAction('AUTH/LOGIN', 'AUTH/LOGIN_SUCCESS', 'AUTH/LOGIN_FAILURE')<
  string | undefined,
  IUser | null,
  string
>();

const signUpAsync = createAsyncAction('AUTH/SIGNUP', 'AUTH/SIGNUP_SUCCESS', 'AUTH/SIGNUP_FAILURE')<
  string | undefined,
  undefined,
  string
>();

const getDeviceStatusAsync = createAsyncAction(
  'AUTH/GET_DEVICE_STATUS',
  'AUTH/GET_DEVICE_STATUS_SUCCESS',
  'AUTH/GET_DEVICE_STATUS_FAILURE',
)<string, DeviceState | undefined, string>();

export const actions = {
  init,
  clearError,
  setSettings,
  disconnect,
  logout,
  setCompany,
  checkDeviceAsync,
  loginUserAsync,
  signUpAsync,
  activateDeviceAsync,
  getDeviceStatusAsync,
};

export type AuthActionType = ActionType<typeof actions>;
