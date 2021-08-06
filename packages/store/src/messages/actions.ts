import { IMessage, StatusType } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('MESSAGES/INIT')();
const updateStatusMessage = createAction('MESSAGES/UPDATE_STATUS')<{ id: string; status: StatusType }>();

const removeMessageAsync = createAsyncAction(
  'MESSAGES/REMOVE_MESSAGE',
  'MESSAGES/REMOVE_MESSAGE_SUCCESS',
  'MESSAGES/REMOVE_MESSAGE_FAILURE',
)<string | undefined, string, string>();

const clearMessagesAsync = createAsyncAction(
  'MESSAGES/CLEAR_MESSAGES',
  'MESSAGES/CLEAR_MESSAGES_SUCCESS',
  'MESSAGES/CLEAR_MESSAGES_FAILURE',
)<string | undefined, undefined, string>();

//const deleteAllMessages = createAction('MESSAGES/DELETE_ALL')();
const clearError = createAction('MESSAGES/CLEAR_ERROR')();

const fetchMessagesAsync = createAsyncAction('MESSAGES/FETCH', 'MESSAGES/FETCH_SUCCESS', 'MESSAGES/FETCH_FAILURE')<
  string | undefined,
  IMessage[],
  string
>();

// const sendMessagesAsync = createAsyncAction('MESSAGES/SEND', 'MESSAGES/SEND_SUCCESS', 'MESSAGES/SEND_FAILURE')<
//   string | undefined,
//   IMessage[],
//   string
// >();

export const actions = {
  fetchMessagesAsync,
  updateStatusMessage,
  removeMessageAsync,
  clearMessagesAsync,
  init,
  clearError,
};

export type MsgActionType = ActionType<typeof actions>;
