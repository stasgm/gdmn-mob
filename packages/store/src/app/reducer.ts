import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

export const initialState: Readonly<IAppState> = {
  loading: false,
  errorMessage: '',
  formParams: {},
  errorList: [],
  loadingData: false,
  loadingError: '',
};

const reducer: Reducer<IAppState, AppActionType> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case getType(appActions.init):
      return initialState;

    case getType(appActions.setFormParams):
      return {
        ...state,
        formParams: { ...state.formParams, ...action.payload },
      };

    case getType(appActions.clearFormParams):
      return {
        ...state,
        formParams: {},
      };

    case getType(appActions.setLoading):
      return {
        ...state,
        loading: action.payload,
      };

    case getType(appActions.setErrorList):
      return {
        ...state,
        errorList: action.payload,
      };

    case getType(appActions.setSyncDate):
      return {
        ...state,
        syncDate: action.payload,
      };

    case getType(appActions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(appActions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(appActions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
