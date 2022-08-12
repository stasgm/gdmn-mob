import { ActionType, createAction } from 'typesafe-actions';

import { FpMovementState, ITempDocument, ITempLine } from './types';

const init = createAction('APP_FP_MOVEMENT/INIT')();
const addTempOrder = createAction('APP_FP_MOVEMENT/ADD_ONE')<ITempDocument>();
const addTempOrders = createAction('APP_FP_MOVEMENT/ADD_MANY')<ITempDocument[]>();
const updateTempOrderLine = createAction('APP_FP_MOVEMENT/UPDATE_LINE_ONE')<{ docId: string; line: ITempLine }>();
const removeTempOrderLine = createAction('APP_FP_MOVEMENT/REMOVE_LINE_ONE')<{ docId: string; lineId: string }>();
const removeTempOrder = createAction('APP_FP_MOVEMENT/REMOVE_ONE')<string>();

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
  addTempOrder,
  addTempOrders,
  updateTempOrderLine,
  removeTempOrderLine,
  removeTempOrder,
};

export type FpMovementActionType = ActionType<typeof actions>;
