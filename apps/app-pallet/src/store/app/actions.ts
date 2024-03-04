import { ActionType, createAction } from 'typesafe-actions';

import { AppInventoryState } from './types';

const init = createAction('APP_INVENTORY/INIT')();
const loadData = createAction('APP_INVENTORY/LOAD_DATA')<AppInventoryState>();
const setLoading = createAction('APP_INVENTORY/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_INVENTORY/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_INVENTORY/SET_LOADING_ERROR')<string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setLoadingData,
  setLoadingError,
};

export type AppInventoryActionType = ActionType<typeof actions>;
