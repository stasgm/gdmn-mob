import { IEntity } from '@lib/types';
import { ActionType, createAction } from 'typesafe-actions';

import { FpMovementState, IOrder } from './types';

const init = createAction('APP_FP_MOVEMENT/INIT')();
const addOrder = createAction('APP_FP_MOVEMENT/ADD_ONE')<IOrder>();
const updateOrderLine = createAction('APP_FP_MOVEMENT/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const removeOrderLine = createAction('APP_FP_MOVEMENT/REMOVE_LINE_ONE')<{ docId: string; lineId: string }>();

const loadData = createAction('APP_FP_MOVEMENT/LOAD_DATA')<FpMovementState>();
const setLoading = createAction('APP_FP_MOVEMENT/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_FP_MOVEMENT/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_FP_MOVEMENT/SET_LOADING_ERROR')<string>();

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

export type FpMovementActionType = ActionType<typeof actions>;
