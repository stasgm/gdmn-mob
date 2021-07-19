import { Reducer } from 'redux';

import { getType } from 'typesafe-actions';

import { config } from '@lib/client-config';

import { AuthState } from './types';
import { AuthActionType, actions } from './actions';
// import { config } from '@lib/mock';

const {
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const initialState: Readonly<AuthState> = {
  user: undefined,
  device: undefined,
  company: undefined,
  deviceStatus: undefined,
  settings: {
    apiPath,
    port,
    protocol,
    server: name,
    timeout,
  },
  error: false,
  loading: false,
  status: '',
};

const reducer: Reducer<AuthState, AuthActionType> = (state = initialState, action): AuthState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.clearError):
      return { ...state, error: false, status: '' };

    case getType(actions.setSettings):
      return { ...state, settings: action.payload };
    // Device
    case getType(actions.checkDeviceAsync.request):
      return { ...state, loading: true, status: '', error: false };

    case getType(actions.checkDeviceAsync.success):
      return { ...state, loading: false, status: '', error: false, device: action.payload };

    case getType(actions.checkDeviceAsync.failure):
      return { ...state, loading: false, status: action.payload, error: true };

    case getType(actions.activateDeviceAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(actions.activateDeviceAsync.success):
      console.log('action.payload?.state', action.payload?.state);
      return {
        ...state,
        device: action.payload,
        deviceStatus: action.payload?.state,
        error: false,
        status: '',
        loading: false,
      };

    case getType(actions.activateDeviceAsync.failure):
      return { ...state, device: null, error: true, status: action.payload, loading: false };
    // User
    case getType(actions.loginUserAsync.request):
      return { ...state, error: false, status: '', loading: true, user: undefined };

    case getType(actions.loginUserAsync.success):
      return { ...state, user: action.payload, error: false, status: '', loading: false, company: undefined };

    case getType(actions.loginUserAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false, user: null };

    case getType(actions.signUpAsync.request):
      return { ...state, error: false, status: '', loading: true, user: undefined };

    case getType(actions.signUpAsync.success):
      return { ...state, user: undefined, error: false, status: '', loading: false, company: undefined };

    case getType(actions.signUpAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false, user: null };

    case getType(actions.logout):
      return { ...state, user: undefined };
    // Misc
    case getType(actions.setCompany):
      return { ...state, company: action.payload };

    case getType(actions.disconnect):
      return { ...state, device: undefined, deviceStatus: undefined, error: false, status: '', loading: false };

    case getType(actions.getDeviceStatusAsync.request):
      return { ...state, loading: true, deviceStatus: undefined, status: '', error: false };

    case getType(actions.getDeviceStatusAsync.success):
      return { ...state, loading: false, status: '', error: false, deviceStatus: action.payload };

    case getType(actions.getDeviceStatusAsync.failure):
      return { ...state, loading: false, status: action.payload, deviceStatus: undefined, error: true };

    default:
      return state;
  }
};

export default reducer;
