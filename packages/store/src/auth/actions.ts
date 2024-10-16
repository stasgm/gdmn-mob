import { IApiConfig } from '@lib/client-types';
import { IDevice, IUser, ICompany, INamedEntity } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AuthState, ConnectionStatus } from './types';

const init = createAction('AUTH/INIT')();
const clearError = createAction('AUTH/CLEAR_ERROR')();
const loadData = createAction('AUTH/LOAD_DATA')<AuthState>();
const setConfig = createAction('AUTH/SET_CONFIG')<IApiConfig>();
const setCompany = createAction('AUTH/SET_COMPANY')<ICompany | undefined>();
const setAppSystem = createAction('AUTH/SET_APP_SYSTEM')<INamedEntity | undefined>();
const setConnectionStatus = createAction('AUTH/SET_CONNECTION_STATUS')<ConnectionStatus>();
const setLoading = createAction('AUTH/SET_LOADING')<boolean>();
const setLoadingData = createAction('AUTH/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('AUTH/SET_LOADING_ERROR')<string>();
const setInit = createAction('AUTH/SET_IS_INIT')<boolean>();
const setIsConfigFirst = createAction('AUTH/SET_IS_CONFIGFIRST')<boolean>();
const setIsLogOut = createAction('AUTH/SET_IS_LOGOUT')<boolean>();
const setErrorMessage = createAction('AUTH/SET_ERROR_MESSAGE')<string>();

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

const checkAccessCodeAsync = createAsyncAction(
  'AUTH/VERIFY_ACCESS_CODE',
  'AUTH/VERIFY_ACCESS_CODE_SUCCESS',
  'AUTH/VERIFY_ACCESS_CODE_FAILURE',
)<string | undefined, boolean, string>();

const loginUserAsync = createAsyncAction('AUTH/LOGIN', 'AUTH/LOGIN_SUCCESS', 'AUTH/LOGIN_FAILURE')<
  string | undefined,
  IUser | undefined,
  string
>();

const signupAsync = createAsyncAction('AUTH/SIGNUP', 'AUTH/SIGNUP_SUCCESS', 'AUTH/SIGNUP_FAILURE')<
  undefined,
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
)<string, ConnectionStatus, string>();

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
  getDeviceByUidAsync,
  loginUserAsync,
  signupAsync,
  activateDeviceAsync,
  getDeviceStatusAsync,
  setConnectionStatus,
  getCompanyAsync,
  setDemoModeAsync,
  checkAccessCodeAsync,
  setLoading,
  setLoadingData,
  setLoadingError,
  setInit,
  setIsConfigFirst,
  setIsLogOut,
  setAppSystem,
  setErrorMessage,
};

export type AuthActionType = ActionType<typeof actions>;
