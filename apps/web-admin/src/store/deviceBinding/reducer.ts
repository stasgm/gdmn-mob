import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDeviceBindingState } from './types';
import { DeviceBindingActionType, deviceBindingActions } from './actions';

const initialState: Readonly<IDeviceBindingState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IDeviceBindingState, DeviceBindingActionType> = (
  state = initialState,
  action,
): IDeviceBindingState => {
  switch (action.type) {
    case getType(deviceBindingActions.init):
      return initialState;

    case getType(deviceBindingActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(deviceBindingActions.fetchDeviceBindingsAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(deviceBindingActions.fetchDeviceBindingsAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(deviceBindingActions.fetchDeviceBindingsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(deviceBindingActions.addDeviceBindingAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceBindingActions.addDeviceBindingAsync.success):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
        loading: false,
      };

    case getType(deviceBindingActions.addDeviceBindingAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Обновление компании
    case getType(deviceBindingActions.updateDeviceBindingAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceBindingActions.updateDeviceBindingAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(deviceBindingActions.updateDeviceBindingAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Получение компании
    case getType(deviceBindingActions.fetchDeviceBindingAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(deviceBindingActions.fetchDeviceBindingAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(deviceBindingActions.fetchDeviceBindingAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };
    default:
      return state;
  }
};

export default reducer;
