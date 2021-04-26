import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IReference } from './types';

const init = createAction('REF/INIT')();

const fetchRefsAsync = createAsyncAction('REF/FETCH', 'REF/FETCH_SUCCCES', 'REF/FETCH_FAILURE')<
  string | undefined,
  IReference[],
  string
>();

export const refActions = {
  fetchRefsAsync,
  init,
};

export type RefActionType = ActionType<typeof refActions>;
