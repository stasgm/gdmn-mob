import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IMDGoodRemain, IModelData } from '../types';

const init = createAction('APP_INVENTORY/INIT')();

const setModelAsync = createAsyncAction(
  'APP_INVENTORY/SET_MODEL',
  'APP_INVENTORY/SET_MODEL_SUCCESS',
  'APP_INVENTORY/SET_MODEL_FAILURE',
)<string | undefined, IModelData<IMDGoodRemain>, string>();

export const actions = {
  init,
  setModelAsync,
};

export type AppInventoryActionType = ActionType<typeof actions>;
