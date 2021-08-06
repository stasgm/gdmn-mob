import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';

import { ISettings } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { SettingsActionType, actions } from './actions';
import { SettingsState } from './types';

export type SettingDispatch = ThunkDispatch<SettingsState, any, SettingsActionType>;

export const useSettingThunkDispatch = () => useDispatch<SettingDispatch>();

const addSettings = (
  settings: ISettings,
): AppThunk<
  Promise<ActionType<typeof actions.addSettingsAsync>>,
  SettingsState,
  ActionType<typeof actions.addSettingsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.addSettingsAsync.request(''));

    //TODO: проверка
    if (settings) {
      return dispatch(actions.addSettingsAsync.success(settings));
    }

    return dispatch(actions.addSettingsAsync.failure('something wrong'));
  };
};

export default { addSettings, useSettingThunkDispatch };
