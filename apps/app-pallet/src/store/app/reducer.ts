import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppPalletActionType } from './actions';

import { AppPalletState } from './types';

export const initialState: Readonly<AppPalletState> = {
  loading: false,
  loadingData: false,
  errorMessage: '',
  loadingError: '',
};

const reducer: Reducer<AppPalletState, AppPalletActionType> = (state = initialState, action): AppPalletState => {
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
