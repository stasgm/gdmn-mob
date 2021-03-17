import { IDevice, IUser } from '@lib/common-types';
import { IApiConfig } from '@lib/common-client-types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IAuthState } from './types';

const init = createAction('AUTH/INIT')<IAuthState>();
export const setSettings = createAction('AUTH/SET_SETTINGS')<IApiConfig>();

export const setSettingsForm = createAction('AUTH/SET_SETTINGS_FORM')<boolean>();
export const disconnect = createAction('AUTH/DISCONNECT')();
export const logout = createAction('AUTH/LOGOUT')(); // TODO Сделать sync c выходом на сервере

const checkDeviceAsync = createAsyncAction('AUTH/CONNECTION', 'AUTH/CONNECTION_SUCCCES', 'AUTH/CONNECTION_FAILURE')<
  undefined,
  IDevice,
  string
>();

const loginUserAsync = createAsyncAction('AUTH/LOGIN', 'AUTH/LOGIN_SUCCCES', 'AUTH/LOGIN_FAILURE')<
  string,
  IUser,
  string
>();

export const authActions = { init, setSettings, disconnect, setSettingsForm, logout, checkDeviceAsync, loginUserAsync };

export type AuthActionType = ActionType<typeof authActions>;
