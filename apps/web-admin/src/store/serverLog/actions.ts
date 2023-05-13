import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IServerLogFile, IServerLogResponse } from '@lib/types';

const init = createAction('SERVERLOG/INIT')();
const clearError = createAction('SERVERLOG/CLEAR_ERROR')();
const setError = createAction('SERVERLOG/SET_ERROR')();

const fetchServerLogsAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOGS',
  'SERVERLOG/FETCH_SERVERLOGS_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOGS_FAILURE',
)<string | undefined, IServerLogFile[], string>();

const fetchServerLogAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOG',
  'SERVERLOG/FETCH_SERVERLOG_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOG_FAILURE',
)<string | undefined, IServerLogResponse, string>();

export const serverLogActions = {
  fetchServerLogsAsync,
  fetchServerLogAsync,
  clearError,
  init,
  setError,
};

export type ServerLogActionType = ActionType<typeof serverLogActions>;
