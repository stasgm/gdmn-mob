import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDeviceState } from './types';
import { DeviceActionType, deviceActions } from './actions';

const initialState: Readonly<IDeviceState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IDeviceState, DeviceActionType> = (state = initialState, action): IDeviceState => {
  switch (action.type) {
    case getType(deviceActions.init):
      return initialState;

    case getType(deviceActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(deviceActions.fetchDevicesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(deviceActions.fetchDevicesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(deviceActions.fetchDevicesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceActions.addDeviceAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceActions.addDeviceAsync.success):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
        loading: false,
      };

    case getType(deviceActions.addDeviceAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Обновление компании
    case getType(deviceActions.updateDeviceAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceActions.updateDeviceAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(deviceActions.updateDeviceAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceActions.removeDeviceAsync.request):
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case getType(deviceActions.removeDeviceAsync.success):
      return {
        ...state,
        loading: false,
        list: [...state.list.filter((i) => i.id !== action.payload)],
      };

    case getType(deviceActions.removeDeviceAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Получение компании
    case getType(deviceActions.fetchDeviceAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceActions.fetchDeviceAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(deviceActions.fetchDeviceAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(deviceActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
