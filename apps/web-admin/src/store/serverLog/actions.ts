import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { ServerInfo, ServerLogFile } from '@lib/types';

import { IPageParam } from '../../types';

const init = createAction('SERVERLOG/INIT')();
const clearError = createAction('SERVERLOG/CLEAR_ERROR')();
const setError = createAction('SERVERLOG/SET_ERROR')();

const fetchServerLogsAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOGS',
  'SERVERLOG/FETCH_SERVERLOGS_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOGS_FAILURE',
)<string | undefined, ServerLogFile[], string>();

const fetchServerLogAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOG',
  'SERVERLOG/FETCH_SERVERLOG_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOG_FAILURE',
)<string | undefined, string, string>();

const fetchServerInfoAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERINFO',
  'SERVERLOG/FETCH_SERVERINFO_SUCCESS',
  'SERVERLOG/FETCH_SERVERINFO_FAILURE',
)<undefined, ServerInfo, string>();

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
  fetchServerInfoAsync,
};

export type ServerLogActionType = ActionType<typeof serverLogActions>;
