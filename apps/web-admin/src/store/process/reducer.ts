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
      return { ...state, errorMessage: 'Процесс уже существует' };

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

    // case getType(activationCodeActions.createCodeAsync.request):
    //   return { ...state, loading: true, errorMessage: '' };

    // case getType(activationCodeActions.createCodeAsync.success):
    //   return {
    //     ...state,
    //     list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
    //     loading: false,
    //   };

    // case getType(activationCodeActions.createCodeAsync.failure):
    //   return {
    //     ...state,
    //     loading: false,
    //     errorMessage: action.payload || 'error',
    //   };

    default:
      return state;
  }
};

export default reducer;
