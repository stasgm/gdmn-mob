import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppInventoryActionType } from './actions';

import { AppInventoryState } from './types';

const initialState: Readonly<AppInventoryState> = {
  model: {},
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<AppInventoryState, AppInventoryActionType> = (
  state = initialState,
  action,
): AppInventoryState => {
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