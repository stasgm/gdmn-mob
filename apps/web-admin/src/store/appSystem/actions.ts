import { IAppSystem } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IPageParam } from '../../types';

const init = createAction('APP_SYSTEM/INIT')();
const clearError = createAction('APP_SYSTEM/CLEAR_ERROR')();
const setError = createAction('APP_SYSTEM/SET_ERROR')();

const fetchAppSystemsAsync = createAsyncAction(
  'APP_SYSTEM/FETCH_APP_SYSTEMS',
  'APP_SYSTEM/FETCH_APP_SYSTEMS_SUCCESS',
  'APP_SYSTEM/FETCH_APP_SYSTEMS_FAILURE',
)<string | undefined, IAppSystem[], string>();

const fetchAppsystemAsync = createAsyncAction(
  'APP_SYSTEM/FETCH_APP_SYSTEM',
  'APP_SYSTEM/FETCH_APP_SYSTEM_SUCCESS',
  'APP_SYSTEM/FETCH_APP_SYSTEM_FAILURE',
)<string | undefined, IAppSystem, string>();

const setPageParam = createAction('APP_SYSTEM/SET_PARAM')<IPageParam | undefined>();
const clearPageParams = createAction('APP_SYSTEM/CLEAR_PARAMS')();

export const appSystemActions = {
  fetchAppsystemAsync,
  fetchAppSystemsAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
  setError,
};

export type AppSystemActionType = ActionType<typeof appSystemActions>;
