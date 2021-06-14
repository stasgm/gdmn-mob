import { ThunkAction } from 'redux-thunk';

import { IDocument } from '@lib/types';

import { sleep } from '@lib/client-api';

import { IDocumentState } from './types';

import { DocumentActionType, actions } from './actions';

export type AppThunk = ThunkAction<Promise<DocumentActionType>, IDocumentState, null, DocumentActionType>;

export const addDocuments = (documents: IDocument[]): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.addDocumentsAsync.request(''));

    await sleep(500);
    //TODO: проверка
    if (documents) {
      return dispatch(actions.addDocumentsAsync.success(documents));
    }

    return dispatch(actions.addDocumentsAsync.failure('something wrong'));
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

export default { addDocuments };
