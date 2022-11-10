import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

export const initialState: Readonly<IAppState> = {
  loading: false,
  showSyncInfo: false,
  autoSync: false,
  formParams: {},
  errorLog: [],
  loadingData: false,
  loadingError: '',
  requestNotice: [],
  errorNotice: [],
};

const LOG_MAX_LINES = 1000;

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
        errorLog: [...state.errorLog, action.payload],
      };

    case getType(appActions.setSentErrors):
      return {
        ...state,
        errorLog: state.errorLog.map((i) => (action.payload.indexOf(i.id) === -1 ? i : { ...i, isSent: true })),
      };

    case getType(appActions.clearErrors):
      return {
        ...state,
        errorLog: action.payload === 'old' ? state.errorLog.filter((i) => i.isSent).slice(0, LOG_MAX_LINES) : [],
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
