import { ActionType, createAction } from 'typesafe-actions';

import { IOrderHead } from '../docs/types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<Partial<IOrderHead>>();
const cleanFormParams = createAction('APP/CLEAN_FORM_PARAMS')();

export const appActions = {
  init,
  setFormParams,
  cleanFormParams,
};

export type AppActionType = ActionType<typeof appActions>;
