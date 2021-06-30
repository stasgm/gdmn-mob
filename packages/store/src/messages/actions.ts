import { IMessage, TStatusMessage } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('MESSAGES/INIT')();
const updateStatusMessage = createAction('MESSAGES/UPDATE_STATUS')<{ id: string; newStatus: TStatusMessage }>();
const deleteMessage = createAction('MESSAGES/DELETE')<string>();
const deleteAllMessages = createAction('MESSAGES/DELETE_ALL')();
const clearError = createAction('MESSAGES/CLEAR_ERROR')();

const fetchMsgAsync = createAsyncAction('MESSAGES/FETCH', 'MESSAGES/FETCH_SUCCESS', 'MESSAGES/FETCH_FAILURE')<
  string | undefined,
  IMessage[],
  string
>();

export const actions = {
  fetchMsgAsync,
  updateStatusMessage,
  deleteMessage,
  deleteAllMessages,
  init,
  clearError,
};

export type MsgActionType = ActionType<typeof actions>;
