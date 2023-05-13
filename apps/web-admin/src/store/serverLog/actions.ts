import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IServerLog } from '../../types';

const init = createAction('SERVERLOG/INIT')();
const clearError = createAction('SERVERLOG/CLEAR_ERROR')();
const setError = createAction('SERVERLOG/SET_ERROR')();

const fetchServerLogsAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOGS',
  'SERVERLOG/FETCH_SERVERLOGS_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOGS_FAILURE',
)<string | undefined, IServerLog[], string>();

const fetchServerLogAsync = createAsyncAction(
  'SERVERLOG/FETCH_SERVERLOG',
  'SERVERLOG/FETCH_SERVERLOG_SUCCESS',
  'SERVERLOG/FETCH_SERVERLOG_FAILURE',
)<string | undefined, any, string>();

export const serverLogActions = {
  fetchServerLogsAsync,
  fetchServerLogAsync,
  clearError,
  init,
  setError,
};

export type ServerLogActionType = ActionType<typeof serverLogActions>;
