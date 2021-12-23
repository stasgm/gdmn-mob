import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { AppTradeState, IGoodModel, IModelData } from './types';

const init = createAction('APP_TRADE/INIT')();
const loadData = createAction('APP_TRADE/LOAD_DATA')<AppTradeState>();

const setGoodModelAsync = createAsyncAction(
  'APP_TRADE/SET_GOOD_MODEL',
  'APP_TRADE/SET_GOOD_MODEL_SUCCESS',
  'APP_TRADE/SET_GOOD_MODEL_FAILURE',
)<string | undefined, IModelData<IGoodModel>, string>();

export const actions = {
  init,
  setGoodModelAsync,
  loadData,
};

export type AppTradeActionType = ActionType<typeof actions>;
