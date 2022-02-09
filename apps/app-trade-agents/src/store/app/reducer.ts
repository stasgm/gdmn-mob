import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppTradeActionType } from './actions';

import { AppTradeState } from './types';

export const initialState: Readonly<AppTradeState> = {
  goodModel: {},
  loading: false,
  loadingData: false,
  errorMessage: '',
  loadingError: '',
};

const reducer: Reducer<AppTradeState, AppTradeActionType> = (state = initialState, action): AppTradeState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.setGoodModelAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.setGoodModelAsync.success):
      return {
        ...state,
        loading: false,
        goodModel: action.payload,
      };

    case getType(actions.setGoodModelAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(actions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
