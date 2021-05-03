import { IMessage } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('MESSAGES/INIT')();
const deleteMessage = createAction('MESSAGES/DELETE')<string>();
const deleteAllMessages = createAction('MESSAGES/DELETE_ALL')();
const clearError = createAction('MESSAGES/CLEAR_ERROR')();

const fetchMsgAsync = createAsyncAction('MESSAGES/FETCH', 'MESSAGES/FETCH_SUCCCES', 'MESSAGES/FETCH_FAILURE')<
  string | undefined,
  IMessage[],
  string
>();

export const actions = {
  fetchMsgAsync,
  deleteMessage,
  deleteAllMessages,
  init,
  clearError,
};

export type MsgActionType = ActionType<typeof actions>;
