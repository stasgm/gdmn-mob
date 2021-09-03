import { IEntity, IDocument } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DOCUMENT/INIT')();
const addDocument = createAction('DOCUMENT/ADD_ONE')<IDocument>();
const updateDocument = createAction('DOCUMENT/UPDATE_ONE')<{ docId: string; document: IDocument }>();
const removeDocument = createAction('DOCUMENT/REMOVE_ONE')<string>();

const addDocumentLine = createAction('DOCUMENT/ADD_LINE_ONE')<{ docId: string; line: IEntity }>();
const updateDocumentLine = createAction('DOCUMENT_LINE/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const deleteDocumentLine = createAction('DOCUMENT_LINE/REMOVE_LINE_ONE')<{ docId: string; lineId: string }>();

const clearError = createAction('DOCUMENTS/CLEAR_ERROR')();

const setDocumentsAsync = createAsyncAction(
  'DOCUMENTS/SET_ALL',
  'DOCUMENTS/SET_ALL_SUCCESS',
  'DOCUMENTS/SET_ALL_FAILURE',
)<string | undefined, IDocument[], string>();

const addDocumentsAsync = createAsyncAction(
  'DOCUMENTS/ADD_MANY',
  'DOCUMENTS/ADD_MANY_SUCCESS',
  'DOCUMENTS/ADD_MANY_FAILURE',
)<string | undefined, IDocument[], string>();

const updateDocumentsAsync = createAsyncAction(
  'DOCUMENTS/UPDATE_MANY',
  'DOCUMENTS/UPDATE_MANY_SUCCESS',
  'DOCUMENTS/UPDATE_MANY_FAILURE',
)<string | undefined, IDocument[], string>();

const removeDocumentsAsync = createAsyncAction(
  'DOCUMENTS/REMOVE_MANY',
  'DOCUMENTS/REMOVE_MANY_SUCCESS',
  'DOCUMENTS/REMOVE_MANY_FAILURE',
)<string | undefined, string[], string>();

const clearDocumentsAsync = createAsyncAction(
  'DOCUMENTS/CLEAR_DOCUMENTS',
  'DOCUMENTS/CLEAR_DOCUMENTS_SUCCESS',
  'DOCUMENTS/CLEAR_DOCUMENTS_FAILURE',
)<string | undefined, undefined, string>();

export const actions = {
  init,
  addDocumentsAsync,
  clearDocumentsAsync,
  setDocumentsAsync,
  addDocument,
  updateDocument,
  updateDocumentsAsync,
  removeDocument,
  removeDocumentsAsync,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
  clearError,
};

export type DocumentActionType = ActionType<typeof actions>;
