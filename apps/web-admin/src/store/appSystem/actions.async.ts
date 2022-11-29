import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { IAppSystem, NewAppSystem } from '@lib/types';

import { authActions } from '@lib/store';

import { AppState } from '../';

import { webRequest } from '../webRequest';

import { appSystemActions, AppSystemActionType } from './actions';

export type AppThunk = ThunkAction<Promise<AppSystemActionType>, AppState, null, AppSystemActionType>;

const fetchAppSystems = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.fetchAppSystemsAsync.request(''));

    const params: Record<string, string | number> = {};

    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.appSystem.getAppSystems(webRequest(dispatch, authActions), params);
    if (response.type === 'GET_APP_SYSTEMS') {
      return dispatch(appSystemActions.fetchAppSystemsAsync.success(response.appSystems));
    }

    return dispatch(appSystemActions.fetchAppSystemsAsync.failure(response.message));
  };
};

const fetchAppSystemById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.fetchAppSystemAsync.request(''));

    const response = await api.appSystem.getAppSystem(webRequest(dispatch, authActions), id);

    if (response.type === 'GET_APP_SYSTEM') {
      return dispatch(appSystemActions.fetchAppSystemAsync.success(response.appSystem));
    }

    return dispatch(appSystemActions.fetchAppSystemAsync.failure(response.message));
  };
};

const addAppSystem = (appSystem: NewAppSystem): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.addAppSystemAsync.request(''));

    const response = await api.appSystem.addAppSystem(appSystem);

    if (response.type === 'ADD_APP_SYSTEM') {
      return dispatch(appSystemActions.addAppSystemAsync.success(response.appSystem));
    }

    return dispatch(appSystemActions.addAppSystemAsync.failure(response.message));
  };
};

const updateAppSystem = (appSystem: IAppSystem): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.updateAppSystemAsync.request('Обновление подсистемы'));

    const response = await api.appSystem.updateAppSystem(appSystem);

    if (response.type === 'UPDATE_APP_SYSTEM') {
      return dispatch(appSystemActions.updateAppSystemAsync.success(response.appSystem));
    }

    return dispatch(appSystemActions.updateAppSystemAsync.failure(response.message));
  };
};

const removeAppSystem = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.removeAppSystemAsync.request('Удаление подсистемы'));

    const response = await api.appSystem.removeAppSystem(id);

    if (response.type === 'REMOVE_APP_SYSTEM') {
      return dispatch(appSystemActions.removeAppSystemAsync.success(id));
    }

    return dispatch(appSystemActions.removeAppSystemAsync.failure(response.message));
  };
};

export default { fetchAppSystems, fetchAppSystemById, addAppSystem, updateAppSystem, removeAppSystem };
