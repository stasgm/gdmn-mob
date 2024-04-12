import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IErpLogState } from './types';
import { ErpLogActionType, erpLogActions } from './actions';

const initialState: Readonly<IErpLogState> = {
  list: [],
  erpLog: undefined,
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IErpLogState, ErpLogActionType> = (state = initialState, action): IErpLogState => {
  switch (action.type) {
    case getType(erpLogActions.init):
      return initialState;

    case getType(erpLogActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(erpLogActions.setError):
      return { ...state, errorMessage: action.payload || 'error' };

    case getType(erpLogActions.fetchErpLogAsync.request):
      return { ...state, loading: true, erpLog: undefined, errorMessage: '' };

    case getType(erpLogActions.fetchErpLogAsync.success):
      return {
        ...state,
        erpLog: action.payload,
        loading: false,
      };

    case getType(erpLogActions.fetchErpLogAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    default:
      return state;
  }
};

export default reducer;
