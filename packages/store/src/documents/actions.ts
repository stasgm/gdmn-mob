import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IDocument } from './types';

const init = createAction('DOCUMENTS/INIT')();
const deleteDocument = createAction('DOCUMENTS/DELETE')<string>();
const deleteAllDocuments = createAction('DOCUMENTS/DELETE_ALL')();
const clearError = createAction('DOCUMENTS/CLEAR_ERROR')();

const addDocumentsAsync = createAsyncAction(
  'DOCUMENTS/ADD_MANY',
  'DOCUMENTS/ADD_MANY_SUCCCES',
  'DOCUMENTS/ADD_MANY_FAILURE',
)<string | undefined, IDocument[], string>();

const addDocumentAsync = createAsyncAction(
  'DOCUMENTS/ADD_ONE',
  'DOCUMENTS/ADD_ONE_SUCCCES',
  'DOCUMENTS/ADD_ONE_FAILURE',
)<string | undefined, IDocument, string>();

export const actions = {
  addDocumentsAsync,
  addDocumentAsync,
  deleteDocument,
  deleteAllDocuments,
  clearError,
  init,
};

export type DocumentActionType = ActionType<typeof actions>;
