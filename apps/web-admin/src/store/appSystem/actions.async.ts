import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { IAppSystem, NewAppSystem } from '@lib/types';

import { AppState } from '../';

import { appSystemActions, AppSystemActionType } from './actions';

export type AppThunk = ThunkAction<Promise<AppSystemActionType>, AppState, null, AppSystemActionType>;

const fetchAppSystems = (): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.fetchAppSystemsAsync.request(''));

    // const params: Record<string, string | number> = {};

    // const response = await api.appSystem.getAppSystems(params);
    const response = await api.appSystem.getAppSystems();

    if (response.type === 'GET_APP_SYSTEMS') {
      return dispatch(appSystemActions.fetchAppSystemsAsync.success(response.appSystems));
    }

    if (response.type === 'ERROR') {
      return dispatch(appSystemActions.fetchAppSystemsAsync.failure(response.message));
    }

    return dispatch(appSystemActions.fetchAppSystemsAsync.failure('Ошибка получения данных о системах'));
  };
};

const fetchAppSystemById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.fetchAppSystemAsync.request(''));

    const response = await api.appSystem.getAppSystem(id);

    if (response.type === 'GET_APP_SYSTEM') {
      return dispatch(appSystemActions.fetchAppSystemAsync.success(response.appSystem));
    }

    if (response.type === 'ERROR') {
      return dispatch(appSystemActions.fetchAppSystemAsync.failure(response.message));
    }

    return dispatch(appSystemActions.fetchAppSystemAsync.failure('Ошибка получения данных о компании'));
  };
};

const addAppSystem = (appSystem: NewAppSystem): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.addAppSystemAsync.request(''));

    const response = await api.appSystem.addAppSystem(appSystem);

    if (response.type === 'ADD_APP_SYSTEM') {
      return dispatch(appSystemActions.addAppSystemAsync.success(response.appSystem));
    }

    if (response.type === 'ERROR') {
      return dispatch(appSystemActions.addAppSystemAsync.failure(response.message));
    }

    return dispatch(appSystemActions.addAppSystemAsync.failure('Ошибка добавления подсистемы'));
  };
};

const updateAppSystem = (appSystem: IAppSystem): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.updateAppSystemAsync.request('Обновление подсистемы'));

    const response = await api.appSystem.updateAppSystem(appSystem);

    if (response.type === 'UPDATE_APP_SYSTEM') {
      return dispatch(appSystemActions.updateAppSystemAsync.success(response.appSystem));
    }

    if (response.type === 'ERROR') {
      return dispatch(appSystemActions.updateAppSystemAsync.failure(response.message));
    }

    return dispatch(appSystemActions.updateAppSystemAsync.failure('Ошибка обновления подсистемы'));
  };
};

const removeAppSystem = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appSystemActions.removeAppSystemAsync.request('Удаление подсистемы'));

    const response = await api.appSystem.removeAppSystem(id);

    if (response.type === 'REMOVE_APP_SYSTEM') {
      return dispatch(appSystemActions.removeAppSystemAsync.success(id));
    }

    if (response.type === 'ERROR') {
      return dispatch(appSystemActions.removeAppSystemAsync.failure(response.message));
    }

    return dispatch(appSystemActions.removeAppSystemAsync.failure('Ошибка удаления подсистемы'));
  };
};

export default { fetchAppSystems, fetchAppSystemById, addAppSystem, updateAppSystem, removeAppSystem };
