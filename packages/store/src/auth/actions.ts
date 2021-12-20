import { IApiConfig } from '@lib/client-types';
import { IDevice, IUser, ICompany, DeviceState, IUserSettings } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { ConnectionStatus } from './types';

const init = createAction('AUTH/INIT')();
const clearError = createAction('AUTH/CLEAR_ERROR')();

const setSettings = createAction('AUTH/SET_SETTINGS')<IApiConfig>();
const setCompany = createAction('AUTH/SET_COMPANY')<ICompany | undefined>();
const disconnect = createAction('AUTH/DISCONNECT')();
const setDemoMode = createAction('AUTH/SET_DEMO')();
//const logout = createAction('AUTH/LOGOUT')(); // TODO Сделать sync c выходом пользователя на сервере
const setUserToken = createAction('AUTH/SET_USERTOKEN')<string | undefined>();
const setConnectionStatus = createAction('AUTH/SET_CONNECTION_STATUS')<ConnectionStatus>();

const getDeviceByUidAsync = createAsyncAction('AUTH/GET_DEVICE', 'AUTH/GET_DEVICE_SUCCESS', 'AUTH/GET_DEVICE_FAILURE')<
  string | undefined,
  IDevice | undefined,
  string
>();

const activateDeviceAsync = createAsyncAction(
  'AUTH/ACTIVATE_DEVICE',
  'AUTH/ACTIVATE_DEVICE_SUCCESS',
  'AUTH/ACTIVATE_DEVICE_FAILURE',
)<string | undefined, string | undefined, string>();

const loginUserAsync = createAsyncAction('AUTH/LOGIN', 'AUTH/LOGIN_SUCCESS', 'AUTH/LOGIN_FAILURE')<
  string | undefined,
  IUser | undefined,
  string
>();

const signUpAsync = createAsyncAction('AUTH/SIGNUP', 'AUTH/SIGNUP_SUCCESS', 'AUTH/SIGNUP_FAILURE')<
  string | undefined,
  undefined,
  string
>();

const logoutUserAsync = createAsyncAction('AUTH/LOGOUT', 'AUTH/LOGOUT_SUCCESS', 'AUTH/LOGOUT_FAILURE')<
  undefined,
  undefined,
  string
>();

const getCompanyAsync = createAsyncAction('AUTH/GET_COMPANY', 'AUTH/GET_COMPANY_SUCCESS', 'AUTH/GET_COMPANY_FAILURE')<
  string,
  ICompany,
  string
>();

const getDeviceStatusAsync = createAsyncAction(
  'AUTH/GET_DEVICE_STATUS',
  'AUTH/GET_DEVICE_STATUS_SUCCESS',
  'AUTH/GET_DEVICE_STATUS_FAILURE',
)<string, DeviceState | undefined, string>();

const setUserSettingsAsync = createAsyncAction(
  'AUTH/SET_USER_SETTINGS',
  'AUTH/SET_USER_SETTINGS_SUCCESS',
  'AUTH/SET_USER_SETTINGS_FAILURE',
)<string, IUserSettings, string>();

export const actions = {
  init,
  clearError,
  setSettings,
  disconnect,
  logoutUserAsync,
  setCompany,
  setUserToken,
  getDeviceByUidAsync,
  loginUserAsync,
  signUpAsync,
  activateDeviceAsync,
  getDeviceStatusAsync,
  setUserSettingsAsync,
  setConnectionStatus,
  getCompanyAsync,
  setDemoMode,
};

export type AuthActionType = ActionType<typeof actions>;
