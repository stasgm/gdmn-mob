import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppMovementActionType } from './actions';

import { AppMovementState } from './types';

export const initialState: Readonly<AppMovementState> = {
  loading: false,
  loadingData: false,
  errorMessage: '',
  loadingError: '',
};

const reducer: Reducer<AppMovementState, AppMovementActionType> = (state = initialState, action): AppMovementState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

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
