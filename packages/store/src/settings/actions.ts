import { IBaseSettings, Settings, ISettingsOption, IUserSettings } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { SettingsState } from './types';

const init = createAction('SETTINGS/INIT')();
const initData = createAction('SETTINGS/INIT_DATA')();
const updateOption = createAction('SETTINGS/UPDATE_ONE')<{ optionName: string; value: ISettingsOption }>();
const addSettings = createAction('SETTINGS/ADD_MANY')<Settings>();
const deleteOption = createAction('SETTINGS/DELETE_ONE')<keyof IBaseSettings>();
const deleteAllSettings = createAction('SETTINGS/DELETE_ALL')();
const clearError = createAction('SETTINGS/CLEAR_ERROR')();
const loadData = createAction('SETTINGS/LOAD_DATA')<SettingsState>();
const setLoading = createAction('SETTINGS/SET_LOADING')<boolean>();
const setLoadingData = createAction('SETTINGS/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('SETTINGS/SET_LOADING_ERROR')<string>();

const setUserSettingsAsync = createAsyncAction(
  'AUTH/SET_USER_SETTINGS',
  'AUTH/SET_USER_SETTINGS_SUCCESS',
  'AUTH/SET_USER_SETTINGS_FAILURE',
)<string, IUserSettings, string>();

export const actions = {
  updateOption,
  addSettings,
  deleteOption,
  deleteAllSettings,
  init,
  initData,
  clearError,
  loadData,
  setLoading,
  setLoadingData,
  setLoadingError,
  setUserSettingsAsync,
};

export type SettingsActionType = ActionType<typeof actions>;
