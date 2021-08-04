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
      return dispatch(actions.setDocumentsAsync.failure('Ошибка записи докмуентов'));
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

const removeDocument = (
  documentId: string,
): AppThunk<
  Promise<ActionType<typeof actions.removeDocumentAsync>>,
  DocumentState,
  ActionType<typeof actions.removeDocumentAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.removeDocumentAsync.request('Удаление документа'));

    try {
      return dispatch(actions.removeDocumentAsync.success(documentId));
    } catch {
      return dispatch(actions.removeDocumentAsync.failure('Ошибка удаления документа'));
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

// export const addDocument = (document: IDocument): AppThunk => {
//   return async (dispatch) => {
//     dispatch(actions.addDocumentAsync.request(''));

//     await sleep(1000);
//     //TODO: проверка
//     if (document) {
//       return dispatch(actions.addDocumentAsync.success(document));
//     }

//     return dispatch(actions.addDocumentAsync.failure('something wrong'));
//   };
// };

export default { setDocuments, addDocuments, removeDocument, clearDocuments, useDocThunkDispatch };
