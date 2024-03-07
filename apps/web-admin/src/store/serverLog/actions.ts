import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { ISystemFile, IServerLogResponse } from '@lib/types';

import { IPageParam } from '../../types';

const init = createAction('SERVERLOG/INIT')();
const clearError = createAction('SERVERLOG/CLEAR_ERROR')();
const setError = createAction('SERVERLOG/SET_ERROR')();

const fetchServerLogsAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOGS',
  'SERVERLOG/FETCH_SERVERLOGS_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOGS_FAILURE',
)<string | undefined, ISystemFile[], string>();

const fetchServerLogAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOG',
  'SERVERLOG/FETCH_SERVERLOG_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOG_FAILURE',
)<string | undefined, IServerLogResponse, string>();

const setPageParam = createAction('SERVERLOG/SET_PARAM')<IPageParam | undefined>();
const clearPageParams = createAction('SERVERLOG/CLEAR_PARAMS')();

export const serverLogActions = {
  fetchServerLogsAsync,
  fetchServerLogAsync,
  clearError,
  init,
  setError,
  setPageParam,
  clearPageParams,
};

export type ServerLogActionType = ActionType<typeof serverLogActions>;
