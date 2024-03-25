import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IServerLogState } from './types';
import { ServerLogActionType, serverLogActions } from './actions';

const initialState: Readonly<IServerLogState> = {
  list: [],
  serverLog: undefined,
  loading: false,
  errorMessage: '',
  pageParams: undefined,
};

const reducer: Reducer<IServerLogState, ServerLogActionType> = (state = initialState, action): IServerLogState => {
  switch (action.type) {
    case getType(serverLogActions.init):
      return initialState;

    case getType(serverLogActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(serverLogActions.setError):
      return { ...state, errorMessage: '' };

    case getType(serverLogActions.fetchServerLogsAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(serverLogActions.fetchServerLogsAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(serverLogActions.fetchServerLogsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(serverLogActions.fetchServerLogAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(serverLogActions.fetchServerLogAsync.success):
      return {
        ...state,
        serverLog: action.payload,
        // list: action.payload,
        loading: false,
      };

    case getType(serverLogActions.fetchServerLogAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(serverLogActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(serverLogActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
