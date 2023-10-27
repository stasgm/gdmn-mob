import { IUserSettings } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { SettingsState } from './types';
import { actions, SettingsActionType } from './actions';

export type SettingsDispatch = ThunkDispatch<SettingsState, any, SettingsActionType>;

export const useSettingsThunkDispatch = () => useDispatch<SettingsDispatch>();

const setUserSettings = (
  settings: IUserSettings,
): AppThunk<
  Promise<ActionType<typeof actions.setUserSettingsAsync>>,
  SettingsState,
  ActionType<typeof actions.setUserSettingsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setUserSettingsAsync.request(''));

    try {
      return dispatch(actions.setUserSettingsAsync.success(settings));
    } catch {
      return dispatch(actions.setUserSettingsAsync.failure('Ошибка записи настроек пользователя'));
    }
  };
};

export default { setUserSettings };
