import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IProcessState } from './types';
// eslint-disable-next-line import/namespace
import { ProcessActionType, processActions } from './actions';

const initialState: Readonly<IProcessState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IProcessState, ProcessActionType> = (state = initialState, action): IProcessState => {
  switch (action.type) {
    case getType(processActions.init):
      return initialState;

    case getType(processActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(processActions.setError):
      return { ...state, errorMessage: action.payload }; //'Процесс уже существует'

    case getType(processActions.fetchProcessesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(processActions.fetchProcessesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(processActions.fetchProcessesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(processActions.removeProcessAsync.request):
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case getType(processActions.removeProcessAsync.success):
      return {
        ...state,
        loading: false,
        list: [...state.list.filter((i) => i.id !== action.payload)],
      };

    case getType(processActions.removeProcessAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(processActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(processActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
