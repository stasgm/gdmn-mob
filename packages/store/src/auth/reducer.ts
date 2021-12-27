import { Reducer } from 'redux';

import { getType } from 'typesafe-actions';

import { config } from '@lib/client-config';

import { device as mockDevice, user as mockUser } from '@lib/mock';

import { ICompany } from '@lib/types';

import { AuthState } from './types';
import { AuthActionType, actions } from './actions';

const {
  server: { name, port, protocol },
  timeout,
  apiPath,
  version,
  debug: { useMockup },
} = config;

export const initialState: Readonly<AuthState> = {
  user: undefined,
  device: undefined,
  company: undefined,
  connectionStatus: 'not-connected',
  userToken: undefined,
  config: {
    apiPath,
    port,
    version,
    protocol,
    server: name,
    timeout,
    deviceId: undefined,
  },
  error: false,
  loading: false,
  status: '',
  isDemo: useMockup,
};

const reducer: Reducer<AuthState, AuthActionType> = (state = initialState, action): AuthState => {
  // console.log('reducer auth', action.type);
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.clearError):
      return { ...state, error: false, status: '' };

    case getType(actions.setConfig):
      return { ...state, config: action.payload };

    case getType(actions.loadData): {
      console.log('reducer loadData', action.payload);
      return { ...action.payload, loading: false, status: '', error: false };
    }

    case getType(actions.getDeviceByUidAsync.request):
      return { ...state, loading: true, status: '', error: false, device: undefined };

    case getType(actions.getDeviceByUidAsync.success):
      return { ...state, loading: false, status: '', error: false, device: action.payload };

    case getType(actions.getDeviceByUidAsync.failure):
      return { ...state, loading: false, status: action.payload, error: true };

    case getType(actions.activateDeviceAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(actions.activateDeviceAsync.success):
      return {
        ...state,
        error: false,
        status: '',
        loading: false,
        connectionStatus: 'connected',
      };

    case getType(actions.activateDeviceAsync.failure):
      return { ...state, device: undefined, error: true, status: action.payload, loading: false };

    // User
    case getType(actions.loginUserAsync.request):
      return { ...state, error: false, status: '', loading: true, user: undefined };

    case getType(actions.loginUserAsync.success):
      return { ...state, user: action.payload, error: false, status: '', loading: false, company: undefined };

    case getType(actions.loginUserAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false, user: undefined };

    case getType(actions.signupAsync.request):
      return { ...state, error: false, status: '', loading: true, user: undefined };

    case getType(actions.signupAsync.success):
      return { ...state, user: undefined, error: false, status: '', loading: false, company: undefined };

    case getType(actions.signupAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false, user: undefined };

    case getType(actions.logoutUserAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(actions.logoutUserAsync.success):
      return {
        ...state,
        user: undefined,
        error: false,
        status: '',
        loading: false,
        company: undefined,
        isDemo: false,
      };

    case getType(actions.logoutUserAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false, user: undefined };

    case getType(actions.setCompany):
      return { ...state, company: action.payload };

    case getType(actions.setUserToken):
      return { ...state, userToken: action.payload };

    case getType(actions.disconnectAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(actions.disconnectAsync.success):
      return {
        ...state,
        user: undefined,
        device: undefined,
        connectionStatus: 'not-connected',
        error: false,
        status: '',
        loading: false,
        isDemo: false,
      };

    case getType(actions.disconnectAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false };

    case getType(actions.getDeviceStatusAsync.request):
      return { ...state, loading: true, connectionStatus: 'not-connected', status: '', error: false };

    case getType(actions.getDeviceStatusAsync.success):
      return {
        ...state,
        loading: false,
        status: '',
        error: false,
        connectionStatus: action.payload === 'ACTIVE' ? 'connected' : 'not-activated',
      };

    case getType(actions.getDeviceStatusAsync.failure):
      return { ...state, loading: false, status: action.payload, connectionStatus: 'not-connected', error: true };

    case getType(actions.setUserSettingsAsync.request):
      return {
        ...state,
        loading: true,
        status: '',
        error: false,
      };

    case getType(actions.setUserSettingsAsync.success): {
      const newUser = state.user ? { ...state.user, settings: action.payload } : undefined;
      return { ...state, user: newUser, loading: false, status: '', error: false };
    }

    case getType(actions.setUserSettingsAsync.failure):
      return { ...state, loading: false, status: '', error: true };

    case getType(actions.setConnectionStatus):
      return { ...state, error: false, connectionStatus: action.payload };

    case getType(actions.setDemoModeAsync.request):
      return {
        ...state,
        loading: true,
        status: '',
        error: false,
      };

    case getType(actions.setDemoModeAsync.success):
      return {
        ...state,
        connectionStatus: 'connected',
        user: mockUser,
        device: mockDevice,
        // company: mockUser.company as ICompany,
        loading: false,
        isDemo: true,
      };

    case getType(actions.setDemoModeAsync.failure):
      return { ...state, loading: false, status: '', error: true };

    default:
      return state;
  }
};

export default reducer;
