import { IEntity, IDocument } from '@lib/types';

import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { DocumentState } from './types';

const init = createAction('DOCUMENTS/INIT')();
const addDocument = createAction('DOCUMENTS/ADD_ONE')<IDocument>();
const updateDocument = createAction('DOCUMENTS/UPDATE_ONE')<{ docId: string; document: IDocument }>();
// const removeDocument = createAction('DOCUMENTS/REMOVE_ONE')<string>();
const addDocumentLine = createAction('DOCUMENTS/ADD_LINE_ONE')<{ docId: string; line: IEntity }>();
const updateDocumentLine = createAction('DOCUMENTS/UPDATE_LINE_ONE')<{ docId: string; line: IEntity }>();
const removeDocumentLine = createAction('DOCUMENTS/REMOVE_LINE_ONE')<{ docId: string; lineId: string }>();
const clearError = createAction('DOCUMENTS/CLEAR_ERROR')();
const loadData = createAction('DOCUMENTS/LOAD_DATA')<DocumentState>();
const setLoading = createAction('DOCUMENTS/SET_LOADING')<boolean>();
const setLoadingData = createAction('DOCUMENTS/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('DOCUMENTS/SET_LOADING_ERROR')<string>();

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

const removeDocumentAsync = createAsyncAction(
  'DOCUMENTS/REMOVE_ONE',
  'DOCUMENTS/REMOVE_ONE_SUCCESS',
  'DOCUMENTS/REMOVE_ONE_FAILURE',
)<string, string, string>();

const clearDocumentsAsync = createAsyncAction(
  'DOCUMENTS/CLEAR_DOCUMENTS',
  'DOCUMENTS/CLEAR_DOCUMENTS_SUCCESS',
  'DOCUMENTS/CLEAR_DOCUMENTS_FAILURE',
)<string | undefined, undefined, string>();

export const actions = {
  init,
  loadData,
  addDocumentsAsync,
  clearDocumentsAsync,
  setDocumentsAsync,
  addDocument,
  updateDocument,
  updateDocumentsAsync,
  // removeDocument,
  removeDocumentAsync,
  removeDocumentsAsync,
  addDocumentLine,
  updateDocumentLine,
  removeDocumentLine,
  clearError,
  setLoading,
  setLoadingData,
  setLoadingError,
};

export type DocumentActionType = ActionType<typeof actions>;
