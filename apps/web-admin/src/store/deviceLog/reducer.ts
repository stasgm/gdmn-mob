import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDeviceLogState } from './types';
import { DeviceLogActionType, deviceLogActions } from './actions';

const initialState: Readonly<IDeviceLogState> = {
  fileList: [],
  deviceLog: [],
  appVersion: '',
  appSettings: {},
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
      return { ...state, errorMessage: 'Журнал ошибок устройства уже существует' };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.request):
      return { ...state, loading: true, fileList: [], errorMessage: '' };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.success):
      return {
        ...state,
        fileList: action.payload,
        loading: false,
      };

    case getType(deviceLogActions.fetchDeviceLogFilesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceLogActions.fetchDeviceLogAsync.request):
      return { ...state, loading: true, deviceLog: [], appSettings: {}, appVersion: '', errorMessage: '' };

    case getType(deviceLogActions.fetchDeviceLogAsync.success):
      return {
        ...state,
        deviceLog: action.payload.deviceLog,
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
      return { ...state, loading: true, deviceLog: [], appSettings: {}, appVersion: '', errorMessage: '' };

    case getType(deviceLogActions.removeDeviceLogAsync.success):
      return {
        ...state,
        fileList: state.fileList.filter((i) => i.id !== action.payload),
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
        fileList: state.fileList.filter((i) => action.payload.findIndex((fileObj) => fileObj.id === i.id) === -1),
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
