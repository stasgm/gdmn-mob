import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

export const initialState: Readonly<IAppState> = {
  loading: false,
  showSyncInfo: false,
  autoSync: false,
  syncRequests: [],
  formParams: {},
  screenFormParams: {},
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

    case getType(appActions.setScreenFormParams):
      return {
        ...state,
        screenFormParams: {
          ...state.screenFormParams,
          [action.payload.screenName]: state.screenFormParams
            ? { ...state.screenFormParams[action.payload.screenName], ...action.payload.params }
            : action.payload.params,
        },
      };

    case getType(appActions.clearScreenFormParams):
      return {
        ...state,
        screenFormParams: { ...state.screenFormParams, [action.payload]: {} },
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

    case getType(appActions.addErrors):
      return {
        ...state,
        errorLog: [...state.errorLog, ...action.payload],
      };

    case getType(appActions.setSentErrors):
      return {
        ...state,
        errorLog: state.errorLog.map((i) => (action.payload.indexOf(i.id) === -1 ? i : { ...i, isSent: true })),
      };

    case getType(appActions.clearErrors): {
      if (action.payload === 'old') {
        const sentLog = state.errorLog.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const c = sentLog.length - LOG_MAX_LINES;
        return {
          ...state,
          errorLog: c > 0 ? sentLog.slice(c) : sentLog,
        };
      } else {
        return {
          ...state,
          errorLog: [],
        };
      }
    }

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

    case getType(appActions.addSyncRequest): {
      const param = action.payload.param;
      return {
        ...state,
        syncRequests: state.syncRequests
          ? state.syncRequests
              .filter(
                (req) =>
                  !(
                    req.cmdName === action.payload.cmdName &&
                    (param && req.param
                      ? req.param.name === param.name && req.param.value === param.value
                      : !req.param === !param)
                  ),
              )
              .concat(action.payload)
          : [action.payload],
      };
    }

    case getType(appActions.removeSyncRequest): {
      const param = action.payload.param;
      //Удаляем записи с полным совпадением
      return {
        ...state,
        syncRequests: state.syncRequests
          ? state.syncRequests.filter(
              (req) =>
                !(
                  req.cmdName === action.payload.cmdName &&
                  (param && req.param
                    ? req.param.name === param.name && req.param.value === param.value
                    : !req.param === !param)
                ),
            )
          : [],
      };
    }

    default:
      return state;
  }
};

export default reducer;
