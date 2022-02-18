import { ActionType, createAction } from 'typesafe-actions';

import { AppMovementState } from './types';

const init = createAction('APP_BC_MOVEMENT/INIT')();
const loadData = createAction('APP_BC_MOVEMENT/LOAD_DATA')<AppMovementState>();
const setLoading = createAction('APP_BC_MOVEMENT/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_BC_MOVEMENT/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_BC_MOVEMENT/SET_LOADING_ERROR')<string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setLoadingData,
  setLoadingError,
};

export type AppMovementActionType = ActionType<typeof actions>;
