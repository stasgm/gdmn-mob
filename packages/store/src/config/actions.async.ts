import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { IApiConfig } from '@lib/client-types';

import { AppThunk } from '../types';

import { ConfigState } from './types';
import { actions, ConfigActionType } from './actions';

export type ConfigDispatch = ThunkDispatch<ConfigState, any, ConfigActionType>;

export const useConfigThunkDispatch = () => useDispatch<ConfigDispatch>();

const setConfig = (
  settings: IApiConfig,
): AppThunk<
  Promise<ActionType<typeof actions.setConfigAsync>>,
  ConfigState,
  ActionType<typeof actions.setConfigAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setConfigAsync.request(''));

    try {
      return dispatch(actions.setConfigAsync.success(settings));
    } catch {
      return dispatch(actions.setConfigAsync.failure('Ошибка записи настроек приложения'));
    }
  };
};

export default {
  setConfig,
  useConfigThunkDispatch,
};
