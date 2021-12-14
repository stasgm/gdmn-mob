import { Reducer } from 'redux';

import { getType } from 'typesafe-actions';

import { config } from '@lib/client-config';

import { ConfigState } from './types';
import { ConfigActionType, actions } from './actions';

const {
  server: { name, port, protocol },
  timeout,
  apiPath,
  version,
} = config;

const initialState: Readonly<ConfigState> = {
  apiPath,
  port,
  version,
  protocol,
  server: name,
  timeout,
  deviceId: undefined,
  error: false,
  loading: false,
  status: '',
};

const reducer: Reducer<ConfigState, ConfigActionType> = (state = initialState, action): ConfigState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.clearError):
      return { ...state, error: false, status: '' };

    case getType(actions.setConfigAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(actions.setConfigAsync.success):
      return { ...state, loading: false, status: '', error: false, ...action.payload };

    case getType(actions.setConfigAsync.failure):
      return { ...state, loading: false, status: '', error: true };

    default:
      return state;
  }
};

export default reducer;
