import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IModel } from './types';

const init = createAction('APP_TRADE/INIT')();

const setModelAsync = createAsyncAction('APP_TRADE/SET_MODEL', 'APP_TRADE/SET_MODEL_SUCCESS', 'APP/SET_MODEL_FAILURE')<
  string | undefined,
  IModel,
  string
>();

export const actions = {
  init,
  setModelAsync,
};

export type AppTradeActionType = ActionType<typeof actions>;
