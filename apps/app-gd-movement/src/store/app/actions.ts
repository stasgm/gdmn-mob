import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AppInventoryState, IGood, IMDGoodRemains, IModelData } from './types';

const init = createAction('APP_INVENTORY/INIT')();
const loadData = createAction('APP_INVENTORY/LOAD_DATA')<AppInventoryState>();
const setLoading = createAction('APP_INVENTORY/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_INVENTORY/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_INVENTORY/SET_LOADING_ERROR')<string>();
const addUnknownGood = createAction('APP_INVENTORY/ADD_UNKNOWN_GOOD')<IGood>();
const removeOldGood = createAction('APP_INVENTORY/REMOVE_OLD_GOODS')<Date>();
const removeUnknownGood = createAction('APP_INVENTORY/REMOVE_UNKNOWN_GOOD_ONE')<string>();

const setModelAsync = createAsyncAction(
  'APP_INVENTORY/SET_MODEL',
  'APP_INVENTORY/SET_MODEL_SUCCESS',
  'APP_INVENTORY/SET_MODEL_FAILURE',
)<string | undefined, IModelData<IMDGoodRemains>, string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setModelAsync,
  setLoadingData,
  setLoadingError,
  addUnknownGood,
  removeOldGood,
  removeUnknownGood,
};

export type AppInventoryActionType = ActionType<typeof actions>;
