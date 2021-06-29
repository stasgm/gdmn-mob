import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IDocument } from './types';

const init = createAction('DOC/INIT')();

const fetchDocsAsync = createAsyncAction('DOC/FETCH', 'DOC/FETCH_SUCCESS', 'DOC/FETCH_FAILURE')<
  string | undefined,
  IDocument[],
  string
>();

export const docActions = {
  fetchDocsAsync,
  init,
};

export type DocActionType = ActionType<typeof docActions>;
