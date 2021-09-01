import { IEntity, IDocument } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const removeDocumentAsync = createAsyncAction(
  'DOCUMENTS/REMOVE_DOCUMENT',
  'DOCUMENTS/REMOVE_DOCUMENT_SUCCESS',
  'DOCUMENTS/REMOVE_DOCUMENT_FAILURE',
)<string | undefined, string, string>();

export const appActions = {
  removeDocumentAsync,
};

export type AppActionType = ActionType<typeof appActions>;
