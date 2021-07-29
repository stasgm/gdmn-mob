import { IEntity, IDocument } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DOCUMENT/INIT')();
const setDocuments = createAction('DOCUMENT/SET_ALL')<IDocument[]>();
// const deleteDocuments = createAction('DOCUMENT/DELETE_ALL')();

const addDocument = createAction('DOCUMENT/ADD_ONE')<IDocument>();
const updateDocument = createAction('DOCUMENT/UPDATE_ONE')<{ docId: string; document: IDocument }>();
// const deleteDocument = createAction('DOCUMENT/DELETE_ONE')<string>();

const addDocumentLine = createAction('DOCUMENT/ADD_LINE_ONE')<{ docId: string; line: IEntity }>();
const updateDocumentLine = createAction('DOCUMENT_LINE/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const deleteDocumentLine = createAction('DOCUMENT_LINE/DELETE_LINE_ONE')<{ docId: string; lineId: string }>();

const clearError = createAction('DOCUMENTS/CLEAR_ERROR')();

const addDocumentsAsync = createAsyncAction(
  'DOCUMENTS/ADD_MANY',
  'DOCUMENTS/ADD_MANY_SUCCESS',
  'DOCUMENTS/ADD_MANY_FAILURE',
)<string | undefined, IDocument[], string>();

const removeDocumentAsync = createAsyncAction(
  'DOCUMENTS/REMOVE_DOCUMENT',
  'DOCUMENTS/REMOVE_DOCUMENT_SUCCESS',
  'DOCUMENTS/REMOVE_DOCUMENT_FAILURE',
)<string | undefined, string, string>();

const clearDocumentsAsync = createAsyncAction(
  'DOCUMENTS/CLEAR_DOCUMENTS',
  'DOCUMENTS/CLEAR_DOCUMENTS_SUCCESS',
  'DOCUMENTS/CLEAR_DOCUMENTS_FAILURE',
)<string | undefined, undefined, string>();

// const addDocumentAsync = createAsyncAction(
//   'DOCUMENTS/ADD_ONE',
//   'DOCUMENTS/ADD_ONE_SUCCESS',
//   'DOCUMENTS/ADD_ONE_FAILURE',
// )<string | undefined, IDocument, string>();

export const actions = {
  init,
  addDocumentsAsync,
  clearDocumentsAsync,
  setDocuments,
  addDocument,
  updateDocument,
  removeDocumentAsync,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
  clearError,
  // init,
};

export type DocumentActionType = ActionType<typeof actions>;
