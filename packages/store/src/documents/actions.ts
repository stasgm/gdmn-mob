import { IEntity, IDocument } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DOCUMENT/INIT')();
const setDocuments = createAction('DOCUMENT/SET_ALL')<IDocument[]>();
const deleteDocuments = createAction('DOCUMENT/DELETE_ALL')();

const addDocument = createAction('DOCUMENT/ADD_ONE')<IDocument>();
const updateDocument = createAction('DOCUMENT/UPDATE_ONE')<{ docId: string; document: IDocument }>();
const deleteDocument = createAction('DOCUMENT/DELETE_ONE')<string>();

const addDocumentLine = createAction('DOCUMENT/ADD_LINE_ONE')<{ docId: string; line: IEntity }>();
const updateDocumentLine = createAction('DOCUMENT_LINE/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const deleteDocumentLine = createAction('DOCUMENT_LINE/DELETE_LINE_ONE')<{ docId: string; lineId: string }>();

const clearError = createAction('DOCUMENTS/CLEAR_ERROR')();

const addDocumentsAsync = createAsyncAction(
  'DOCUMENTS/ADD_MANY',
  'DOCUMENTS/ADD_MANY_SUCCCES',
  'DOCUMENTS/ADD_MANY_FAILURE',
)<string | undefined, IDocument[], string>();

// const addDocumentAsync = createAsyncAction(
//   'DOCUMENTS/ADD_ONE',
//   'DOCUMENTS/ADD_ONE_SUCCCES',
//   'DOCUMENTS/ADD_ONE_FAILURE',
// )<string | undefined, IDocument, string>();

export const actions = {
  init,
  addDocumentsAsync,
  deleteDocuments,
  setDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
  clearError,
  // init,
};

export type DocumentActionType = ActionType<typeof actions>;
