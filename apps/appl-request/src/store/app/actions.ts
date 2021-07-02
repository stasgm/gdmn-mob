import { ActionType, createAction } from 'typesafe-actions';

import { IFormParam } from './types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP/CLEAN_FORM_PARAMS')();

export const appActions = {
  init,
  setFormParams,
  clearFormParams,
};

export type AppActionType = ActionType<typeof appActions>;
