import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

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

export default { fetchAppSystems };
