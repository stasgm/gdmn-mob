import { IBaseSettings, ISettings, ISettingsOption } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('MESSAGES/INIT')();
const updateSettings =
  createAction('SETTINGS/UPDATE_SETTINGS')<{ optionName: string; value: ISettingsOption<string | number | boolean> }>();
const deleteSettingsOption = createAction('SETTINGS/DELETE_ONE')<keyof IBaseSettings>();
const deleteAllSettings = createAction('SETTINGS/DELETE_ALL')();
const clearError = createAction('SETTINGS/CLEAR_ERROR')();

const addSettingsAsync = createAsyncAction('SETTINGS/ADD', 'SETTINGS/ADD_SUCCESS', 'SETTINGS/ADD_FAILURE')<
  string | undefined,
  ISettings<IBaseSettings>,
  string
>();

export const actions = {
  addSettingsAsync,
  updateSettings,
  deleteSettingsOption,
  deleteAllSettings,
  init,
  clearError,
};

export type SettingsActionType = ActionType<typeof actions>;
