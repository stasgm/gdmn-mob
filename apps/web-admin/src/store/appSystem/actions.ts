import { IAppSystem } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IPageParam } from '../../types';

const init = createAction('APP_SYSTEM/INIT')();
const clearError = createAction('APP_SYSTEM/CLEAR_ERROR')();
const setError = createAction('APP_SYSTEM/SET_ERROR')<string>();

const fetchAppSystemsAsync = createAsyncAction(
  'APP_SYSTEM/FETCH_APP_SYSTEMS',
  'APP_SYSTEM/FETCH_APP_SYSTEMS_SUCCESS',
  'APP_SYSTEM/FETCH_APP_SYSTEMS_FAILURE',
)<string | undefined, IAppSystem[], string>();

const fetchAppSystemAsync = createAsyncAction(
  'APP_SYSTEM/FETCH_APP_SYSTEM',
  'APP_SYSTEM/FETCH_APP_SYSTEM_SUCCESS',
  'APP_SYSTEM/FETCH_APP_SYSTEM_FAILURE',
)<string | undefined, IAppSystem, string>();

const addAppSystemAsync = createAsyncAction('APP_SYSTEM/ADD', 'APP_SYSTEM/ADD_SUCCESS', 'APP_SYSTEM/ADD_FAILURE')<
  string | undefined,
  IAppSystem,
  string
>();

const updateAppSystemAsync = createAsyncAction(
  'APP_SYSTEM/UPDATE',
  'APP_SYSTEM/UPDATE_SUCCESS',
  'APP_SYSTEM/UPDATE_FAILURE',
)<string | undefined, IAppSystem, string>();

const removeAppSystemAsync = createAsyncAction(
  'APP_SYSTEM/REMOVE',
  'APP_SYSTEM/REMOVE_SUCCESS',
  'APP_SYSTEM/REMOVE_FAILURE',
)<string | undefined, string, string>();

const setPageParam = createAction('APP_SYSTEM/SET_PARAM')<IPageParam | undefined>();
const clearPageParams = createAction('APP_SYSTEM/CLEAR_PARAMS')();

export const appSystemActions = {
  fetchAppSystemAsync,
  fetchAppSystemsAsync,
  addAppSystemAsync,
  updateAppSystemAsync,
  removeAppSystemAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
  setError,
};

export type AppSystemActionType = ActionType<typeof appSystemActions>;
