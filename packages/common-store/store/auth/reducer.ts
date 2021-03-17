import { Reducer } from 'redux';

import { getType } from 'typesafe-actions';

import { config } from '../../mock';

import { IAuthState } from './types';
import { AuthActionType, authActions } from './actions';

const initialState: Readonly<IAuthState> = {
  user: undefined,
  device: undefined,
  settings: config,
  error: false,
  loading: false,
  status: '',
  settingsForm: false,
};

const reducer: Reducer<IAuthState, AuthActionType> = (state = initialState, action: AuthActionType) => {
  switch (action.type) {
    case getType(authActions.init):
      return initialState;

    case getType(authActions.disconnect):
      return { ...state, device: undefined, error: false, status: '', loading: false };

    case getType(authActions.setSettingsForm):
      return { ...state, settingsForm: action.payload };

    case getType(authActions.setSettings):
      return { ...state, settings: action.payload, settingsForm: false };

    case getType(authActions.checkDeviceAsync.request):
      return { ...state, loading: true, status: '', error: false };

    case getType(authActions.checkDeviceAsync.success):
      return { ...state, loading: false, status: '', error: false, device: action.payload };

    case getType(authActions.checkDeviceAsync.failure):
      return { ...state, loading: false, status: action.payload, error: true };

    case getType(authActions.loginUserAsync.request):
      return { ...state, error: false, status: '', loading: true };

    case getType(authActions.loginUserAsync.success):
      return { ...state, user: action.payload, error: false, status: '', loading: false };

    case getType(authActions.loginUserAsync.failure):
      return { ...state, error: true, status: action.payload, loading: false };

    case getType(authActions.logout):
      return { ...state, user: undefined };

    default:
      return state;
  }
};

export default reducer;
