import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

export const initialState: Readonly<IAppState> = {
  loading: false,
  showSyncInfo: false,
  autoSync: false,
  formParams: {},
  errorList: [],
  loadingData: false,
  loadingError: '',
  requestNotice: [],
  errorNotice: [],
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

    case getType(appActions.setShowSyncInfo):
      return {
        ...state,
        showSyncInfo: action.payload,
      };

    case getType(appActions.addError):
      return {
        ...state,
        errorList: [...state.errorList, action.payload],
      };

    case getType(appActions.removeErrors):
      return { ...state, errorList: state.errorList.filter((i) => action.payload.indexOf(i.id) === -1) };

    case getType(appActions.clearErrors):
      return {
        ...state,
        errorList: [],
      };

    case getType(appActions.setSyncDate):
      return {
        ...state,
        syncDate: action.payload,
      };

    case getType(appActions.loadData):
      return { ...action.payload, loading: false };

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

    case getType(appActions.addErrorNotice):
      return { ...state, errorNotice: [...state.errorNotice, action.payload] };

    case getType(appActions.clearErrorNotice):
      return { ...state, errorNotice: [] };

    default:
      return state;
  }
};

export default reducer;
