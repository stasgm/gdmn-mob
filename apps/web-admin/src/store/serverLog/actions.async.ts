import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { AppState } from '..';

import { webRequest } from '../webRequest';

import { serverLogActions, ServerLogActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ServerLogActionType>, AppState, null, ServerLogActionType>;

const fetchServerLogs = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  const params: Record<string, string | number> = {};

  if (filterText) params.filterText = filterText;
  if (fromRecord) params.fromRecord = fromRecord;
  if (toRecord) params.toRecord = toRecord;

  return async (dispatch) => {
    dispatch(serverLogActions.fetchServerLogsAsync.request(''));

    const response = await api.serverLog.getServerLogs(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_SERVERLOGS') {
      return dispatch(serverLogActions.fetchServerLogsAsync.success(response.serverLogs));
    }

    return dispatch(serverLogActions.fetchServerLogsAsync.failure(response.message));
  };
};

const fetchServerLog = (name: string): AppThunk => {
  return async (dispatch) => {
    dispatch(serverLogActions.fetchServerLogAsync.request(''));

    const response = await api.serverLog.getServerLog(webRequest(dispatch, authActions), name);

    if (response.type === 'GET_SERVERLOG') {
      return dispatch(serverLogActions.fetchServerLogAsync.success(response.serverLog));
    }

    return dispatch(serverLogActions.fetchServerLogAsync.failure(response.message));
  };
};

export default { fetchServerLogs, fetchServerLog };
