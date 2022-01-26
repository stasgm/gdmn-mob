import { IDocument } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { DocumentState } from './types';

import { actions, DocumentActionType } from './actions';

export type DocDispatch = ThunkDispatch<DocumentState, any, DocumentActionType>;

export const useDocThunkDispatch = () => useDispatch<DocDispatch>();

export const setDocuments = (
  documents: IDocument[],
): AppThunk<
  Promise<ActionType<typeof actions.setDocumentsAsync>>,
  DocumentState,
  ActionType<typeof actions.setDocumentsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setDocumentsAsync.request(''));

    try {
      return dispatch(actions.setDocumentsAsync.success(documents));
    } catch {
      return dispatch(actions.setDocumentsAsync.failure('Ошибка записи документов'));
    }
  };
};

export const addDocuments = (
  documents: IDocument[],
): AppThunk<
  Promise<ActionType<typeof actions.addDocumentsAsync>>,
  DocumentState,
  ActionType<typeof actions.addDocumentsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.addDocumentsAsync.request(''));

    try {
      return dispatch(actions.addDocumentsAsync.success(documents));
    } catch {
      return dispatch(actions.addDocumentsAsync.failure('something wrong'));
    }
  };
};

export const updateDocuments = (
  documents: IDocument[],
): AppThunk<
  Promise<ActionType<typeof actions.updateDocumentsAsync>>,
  DocumentState,
  ActionType<typeof actions.updateDocumentsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.updateDocumentsAsync.request(''));

    try {
      return dispatch(actions.updateDocumentsAsync.success(documents));
    } catch {
      return dispatch(actions.updateDocumentsAsync.failure('Ошибка обновления документов'));
    }
  };
};

const removeDocuments = (
  documentIds: string[],
): AppThunk<
  Promise<ActionType<typeof actions.removeDocumentsAsync>>,
  DocumentState,
  ActionType<typeof actions.removeDocumentsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.removeDocumentsAsync.request('Удаление документов'));

    try {
      return dispatch(actions.removeDocumentsAsync.success(documentIds));
    } catch {
      return dispatch(actions.removeDocumentsAsync.failure('Ошибка удаления документов'));
    }
  };
};

const removeDocument = (
  documentId: string,
): AppThunk<
  Promise<ActionType<typeof actions.removeDocumentAsync>>,
  DocumentState,
  ActionType<typeof actions.removeDocumentAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.removeDocumentAsync.request('Удаление документов'));

    try {
      return dispatch(actions.removeDocumentAsync.success(documentId));
    } catch {
      return dispatch(actions.removeDocumentAsync.failure('Ошибка удаления документов'));
    }
  };
};

const clearDocuments = (): AppThunk<
  Promise<ActionType<typeof actions.clearDocumentsAsync>>,
  DocumentState,
  ActionType<typeof actions.clearDocumentsAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.clearDocumentsAsync.request('Удаление документов'));

    try {
      return dispatch(actions.clearDocumentsAsync.success());
    } catch {
      return dispatch(actions.clearDocumentsAsync.failure('Ошибка удаления документов'));
    }
  };
};

export default {
  setDocuments,
  addDocuments,
  updateDocuments,
  removeDocuments,
  clearDocuments,
  useDocThunkDispatch,
  removeDocument,
};
