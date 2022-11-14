import { IFormParam } from '@lib/store';
import { ActionType, createAction } from 'typesafe-actions';

const init = createAction('APP_TEST/INIT')();

const setFormParams = createAction('APP_TEST/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP_TEST/CLEAR_FORM_PARAMS')();

export const actions = {
  init,
  setFormParams,
  clearFormParams,
};

export type AppTestActionType = ActionType<typeof actions>;
