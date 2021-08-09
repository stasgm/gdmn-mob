import { ActionType, createAction } from 'typesafe-actions';

import { IFormParam } from './types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP/CLEAN_FORM_PARAMS')();
const setLoading = createAction('APP/SET_LOADING')<{ loading: boolean; errorMessage?: string }>();

export const appActions = {
  init,
  setFormParams,
  clearFormParams,
  setLoading,
};

export type AppActionType = ActionType<typeof appActions>;
