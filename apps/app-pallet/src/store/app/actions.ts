import { ActionType, createAction } from 'typesafe-actions';

import { AppPalletState } from './types';

const init = createAction('APP_PALLET/INIT')();
const loadData = createAction('APP_PALLET/LOAD_DATA')<AppPalletState>();
const setLoading = createAction('APP_PALLET/SET_LOADING')<boolean>();
const setLoadingData = createAction('APP_PALLET/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP_PALLET/SET_LOADING_ERROR')<string>();

export const actions = {
  init,
  setLoading,
  loadData,
  setLoadingData,
  setLoadingError,
};

export type AppPalletActionType = ActionType<typeof actions>;
