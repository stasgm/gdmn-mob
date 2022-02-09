import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AppInventoryState, IMDGoodRemain, IModelData } from './types';

const init = createAction('APP_INVENTORY/INIT')();
const loadData = createAction('APP_INVENTORY/LOAD_DATA')<AppInventoryState>();
const setLoading = createAction('APP_INVENTORY/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_INVENTORY/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_INVENTORY/SET_LOADING_ERROR')<string>();

const setModelAsync = createAsyncAction(
  'APP_INVENTORY/SET_MODEL',
  'APP_INVENTORY/SET_MODEL_SUCCESS',
  'APP_INVENTORY/SET_MODEL_FAILURE',
)<string | undefined, IModelData<IMDGoodRemain>, string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setModelAsync,
  setLoadingData,
  setLoadingError,
};

export type AppInventoryActionType = ActionType<typeof actions>;
