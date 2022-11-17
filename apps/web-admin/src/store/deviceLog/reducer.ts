import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDeviceLogState } from './types';
import { DeviceLogActionType, deviceLogActions } from './actions';

const initialState: Readonly<IDeviceLogState> = {
  list: [],
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
      return { ...state, errorMessage: 'Подсистема уже существует' };

    case getType(deviceLogActions.fetchDeviceLogsAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(deviceLogActions.fetchDeviceLogsAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(deviceLogActions.fetchDeviceLogsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

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
