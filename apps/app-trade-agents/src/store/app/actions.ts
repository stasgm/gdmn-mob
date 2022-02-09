import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AppTradeState, IGoodModel, IModelData } from './types';

const init = createAction('APP_TRADE/INIT')();
const loadData = createAction('APP_TRADE/LOAD_DATA')<AppTradeState>();
const setLoading = createAction('APP_TRADE/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_TRADE/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_TRADE/SET_LOADING_ERROR')<string>();

const setGoodModelAsync = createAsyncAction(
  'APP_TRADE/SET_GOOD_MODEL',
  'APP_TRADE/SET_GOOD_MODEL_SUCCESS',
  'APP_TRADE/SET_GOOD_MODEL_FAILURE',
)<string | undefined, IModelData<IGoodModel>, string>();

export const actions = {
  init,
  setGoodModelAsync,
  loadData,
  setLoading,
  setLoadingData,
  setLoadingError,
};

export type AppTradeActionType = ActionType<typeof actions>;
