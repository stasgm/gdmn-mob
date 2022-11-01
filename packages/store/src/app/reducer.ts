import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

export const initialState: Readonly<IAppState> = {
  loading: false,
  loadedWithError: false,
  autoSync: false,
  errorMessage: '',
  formParams: {},
  errorList: [],
  loadingData: false,
  loadingError: '',
  requestNotice: [],
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

    case getType(appActions.setAutoSync):
      return {
        ...state,
        autoSync: action.payload,
      };

    case getType(appActions.setLoadedWithError):
      return {
        ...state,
        loadedWithError: action.payload,
      };

    case getType(appActions.addError):
      return {
        ...state,
        errorList: [...state.errorList, action.payload],
      };

    case getType(appActions.removeErrors):
      return { ...state, errorList: state.errorList.filter((i) => action.payload.indexOf(i.id) === -1) };

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

    case getType(appActions.addRequestNotice):
      return { ...state, requestNotice: [...state.requestNotice, action.payload] };

    case getType(appActions.clearRequestNotice):
      return { ...state, requestNotice: [] };

    default:
      return state;
  }
};

export default reducer;
