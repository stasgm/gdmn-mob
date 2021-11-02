import { IBaseSettings, Settings, ISettingsOption } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('SETTINGS/INIT')();
const addOption = createAction('SETTINGS/ADD_ONE')<{ optionName: string; value: ISettingsOption }>();
const updateOption = createAction('SETTINGS/UPDATE_ONE')<{ optionName: string; value: ISettingsOption }>();
const addSettings = createAction('SETTINGS/ADD_MANY')<Settings>();
const deleteOption = createAction('SETTINGS/DELETE_ONE')<keyof IBaseSettings>();
const deleteAllSettings = createAction('SETTINGS/DELETE_ALL')();
const clearError = createAction('SETTINGS/CLEAR_ERROR')();

const addSettingsAsync = createAsyncAction('SETTINGS/ADD', 'SETTINGS/ADD_SUCCESS', 'SETTINGS/ADD_FAILURE')<
  string | undefined,
  Settings<IBaseSettings>,
  string
>();

export const actions = {
  addSettingsAsync,
  addSetting: addOption,
  updateOption,
  addSettings,
  deleteOption,
  deleteAllSettings,
  init,
  clearError,
};

export type SettingsActionType = ActionType<typeof actions>;
