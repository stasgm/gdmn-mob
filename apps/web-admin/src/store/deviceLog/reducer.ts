import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDeviceLogState } from './types';
import { DeviceLogActionType, deviceLogActions } from './actions';

const initialState: Readonly<IDeviceLogState> = {
  logList: [],
  appVersion: '',
  appSettings: {},
  filesList: [],
  loading: false,
  errorMessage: '',
  pageParams: undefined,
};

const reducer: Reducer<IDeviceLogState, DeviceLogActionType> = (state = initialState, action): IDeviceLogState => {
  switch (action.type) {
    case getType(deviceLogActions.init):
      return initialState;

    case getType(deviceLogActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(deviceLogActions.setError):
      return { ...state, errorMessage: 'Журнал ошибок уже существует' };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.request):
      return { ...state, loading: true, filesList: [], errorMessage: '' };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.success):
      return {
        ...state,
        filesList: action.payload,
        loading: false,
      };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceLogActions.fetchDeviceLogAsync.request):
      return { ...state, loading: true, logList: [], appSettings: {}, appVersion: '', errorMessage: '' };

    case getType(deviceLogActions.fetchDeviceLogAsync.success):
      return {
        ...state,
        logList: action.payload.logs,
        appSettings: action.payload.appSettings,
        appVersion: action.payload.appVersion,
        loading: false,
      };

    case getType(deviceLogActions.fetchDeviceLogAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceLogActions.removeDeviceLogAsync.request):
      return { ...state, loading: true, logList: [], errorMessage: '' };

    case getType(deviceLogActions.removeDeviceLogAsync.success):
      return {
        ...state,
        filesList: state.filesList.filter((i) => i.id !== action.payload),
        loading: false,
      };

    case getType(deviceLogActions.removeDeviceLogAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceLogActions.removeDeviceLogsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceLogActions.removeDeviceLogsAsync.success):
      return {
        ...state,
        loading: false,
        filesList: state.filesList.filter((i) => action.payload.findIndex((fileObj) => fileObj.id === i.id) === -1),
      };

    case getType(deviceLogActions.removeDeviceLogsAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(deviceLogActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(deviceLogActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
