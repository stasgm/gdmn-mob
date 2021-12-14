import { IApiConfig } from '@lib/client-types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('CONFIG/INIT')();
const clearError = createAction('CONFIG/CLEAR_ERROR')();

const setConfigAsync = createAsyncAction('CONFIG/SET_ALL', 'CONFIG/SET_ALL_SUCCESS', 'CONFIG/SET_ALL_FAILURE')<
  string,
  IApiConfig,
  string
>();

export const actions = {
  init,
  clearError,
  setConfigAsync,
};

export type ConfigActionType = ActionType<typeof actions>;
