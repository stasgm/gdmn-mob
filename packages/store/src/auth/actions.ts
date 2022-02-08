import { IApiConfig } from '@lib/client-types';
import { IDevice, IUser, ICompany, DeviceState, IUserSettings } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AuthState, ConnectionStatus } from './types';

const init = createAction('AUTH/INIT')();
const clearError = createAction('AUTH/CLEAR_ERROR')();
const loadData = createAction('AUTH/LOAD_DATA')<AuthState>();
const setConfig = createAction('AUTH/SET_CONFIG')<IApiConfig>();
const setCompany = createAction('AUTH/SET_COMPANY')<ICompany | undefined>();
const setConnectionStatus = createAction('AUTH/SET_CONNECTION_STATUS')<ConnectionStatus>();
const setUserToken = createAction('AUTH/SET_USERTOKEN')<string | undefined>();
const setLoading = createAction('AUTH/SET_LOADING')<boolean>();
// const setDemoMode = createAction('AUTH/SET_DEMOMODE')();
const setLoadingData = createAction('AUTH/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('AUTH/SET_LOADING_ERROR')<string>();
const setInit = createAction('AUTH/SET_IS_INIT')<boolean>();

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

const signupAsync = createAsyncAction('AUTH/SIGNUP', 'AUTH/SIGNUP_SUCCESS', 'AUTH/SIGNUP_FAILURE')<
  string | undefined,
  undefined,
  string
>();

const logoutUserAsync = createAsyncAction('AUTH/LOGOUT', 'AUTH/LOGOUT_SUCCESS', 'AUTH/LOGOUT_FAILURE')<
  undefined,
  undefined,
  string
>();

const disconnectAsync = createAsyncAction('AUTH/DISCONNECT', 'AUTH/DISCONNECT_SUCCESS', 'AUTH/DISCONNECT_FAILURE')<
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

const setDemoModeAsync = createAsyncAction(
  'AUTH/SET_DEMOMODE',
  'AUTH/SET_DEMOMODE_SUCCESS',
  'AUTH/SET_DEMOMODE_FAILURE',
)<string, undefined, string>();

export const actions = {
  init,
  loadData,
  clearError,
  setConfig,
  disconnectAsync,
  logoutUserAsync,
  setCompany,
  setUserToken,
  getDeviceByUidAsync,
  loginUserAsync,
  signupAsync,
  activateDeviceAsync,
  getDeviceStatusAsync,
  setUserSettingsAsync,
  setConnectionStatus,
  getCompanyAsync,
  setDemoModeAsync,
  setLoading,
  setLoadingData,
  setLoadingError,
  setInit,
};

export type AuthActionType = ActionType<typeof actions>;
