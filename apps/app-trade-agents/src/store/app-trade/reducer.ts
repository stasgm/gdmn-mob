import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppTradeActionType } from './actions';

import { AppTradeState } from './types';

const initialState: Readonly<AppTradeState> = {
  model: {},
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<AppTradeState, AppTradeActionType> = (state = initialState, action): AppTradeState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setModelAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.setModelAsync.success):
      return {
        ...state,
        loading: false,
        model: action.payload,
      };

    case getType(actions.setModelAsync.failure):
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
