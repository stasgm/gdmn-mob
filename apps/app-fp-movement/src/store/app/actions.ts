import { IEntity } from '@lib/types';
import { ActionType, createAction } from 'typesafe-actions';

import { AppInventoryState, IOrder } from './types';

const init = createAction('APP_INVENTORY/INIT')();
const addOrder = createAction('APP_INVENTORY/ADD_ONE')<IOrder>();
const updateOrderLine = createAction('APP_INVENTORY/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const removeOrderLine = createAction('APP_INVENTORY/REMOVE_LINE_ONE')<{ docId: string; lineId: string }>();

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
  addOrder,
  updateOrderLine,
  removeOrderLine,
};

export type AppInventoryActionType = ActionType<typeof actions>;
