import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AppState, IMDGoodRemain, IModelData } from './types';

const init = createAction('APP_DYN_INVENTORY/INIT')();
const loadData = createAction('APP_DYN_INVENTORY/LOAD_DATA')<AppState>();
const setLoading = createAction('APP_DYN_INVENTORY/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_DYN_INVENTORY/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_DYN_INVENTORY/SET_LOADING_ERROR')<string>();

const setModelAsync = createAsyncAction(
  'APP_DYN_INVENTORY/SET_MODEL',
  'APP_DYN_INVENTORY/SET_MODEL_SUCCESS',
  'APP_DYN_INVENTORY/SET_MODEL_FAILURE',
)<string | undefined, IModelData<IMDGoodRemain>, string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setModelAsync,
  setLoadingData,
  setLoadingError,
};

export type AppActionType = ActionType<typeof actions>;
