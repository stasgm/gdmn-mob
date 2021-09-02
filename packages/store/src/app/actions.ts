import { ActionType, createAction } from 'typesafe-actions';

import { IFormParam } from './types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP/CLEAR_FORM_PARAMS')();
const setLoading = createAction('APP/SET_LOADING')<boolean>();
const setErrorList = createAction('APP/SET_ERROR_LIST')<string[]>();

export const appActions = {
  init,
  setFormParams,
  clearFormParams,
  setLoading,
  setErrorList,
};

export type AppActionType = ActionType<typeof appActions>;
