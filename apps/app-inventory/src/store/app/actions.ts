import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IMDGoodRemain, IModelData } from '../types';

import { AppInventoryState } from './types';

const init = createAction('APP_INVENTORY/INIT')();
const setLoading = createAction('APP_INVENTORY/SET_LOADING')<boolean>();
const loadData = createAction('APP_INVENTORY/LOAD_DATA')<AppInventoryState>();

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
};

export type AppInventoryActionType = ActionType<typeof actions>;
