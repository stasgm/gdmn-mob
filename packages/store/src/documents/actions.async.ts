import api, { sleep } from '@lib/client-api';
import { IDocument } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { DocumentState } from './types';

import { actions } from './actions';

//export type AppThunk = ThunkAction<Promise<DocumentActionType>, DocumentState, null, DocumentActionType>;

export const addDocuments = (documents: IDocument[]): AppThunk => {
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

// <
//   Promise<ActionType<typeof actions.clearDocumentsAsync>>,
//   DocumentState,
//   ActionType<typeof actions.clearDocumentsAsync>
// >

const clearDocuments = (): AppThunk => {
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

export default { addDocuments, removeDocument, clearDocuments };
