import { IMessage, StatusType } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IMultipartMessage, MessagesState } from './types';

const init = createAction('MESSAGES/INIT')();
// const updateStatusMessage = createAction('MESSAGES/UPDATE_STATUS')<{ id: string; status: StatusType }>();

// const removeMessageAsync = createAsyncAction(
//   'MESSAGES/REMOVE_MESSAGE',
//   'MESSAGES/REMOVE_MESSAGE_SUCCESS',
//   'MESSAGES/REMOVE_MESSAGE_FAILURE',
// )<string | undefined, string, string>();

// const clearMessagesAsync = createAsyncAction(
//   'MESSAGES/CLEAR_MESSAGES',
//   'MESSAGES/CLEAR_MESSAGES_SUCCESS',
//   'MESSAGES/CLEAR_MESSAGES_FAILURE',
// )<string | undefined, undefined, string>();

const clearError = createAction('MESSAGES/CLEAR_ERROR')();

// const fetchMessagesAsync = createAsyncAction('MESSAGES/FETCH', 'MESSAGES/FETCH_SUCCESS', 'MESSAGES/FETCH_FAILURE')<
//   string | undefined,
//   IMessage[],
//   string
// >();

const loadGlobalDataFromDisc = createAction('MESSAGES/LOAD_GLOBAL_DATA_FROM_DISC')();
const loadSuperDataFromDisc = createAction('MESSAGES/LOAD_SUPER_DATA_FROM_DISC')();
const clearSuperDataFromDisc = createAction('MESSAGES/CLEAR_SUPER_DATA_FROM_DISC')();

const setLoadingData = createAction('MESSAGES/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('MESSAGES/SET_LOADING_ERROR')<string>();
const loadData = createAction('MESSAGES/LOAD_DATA')<MessagesState>();

const addMultipartMessage = createAction('MESSAGES/ADD_MULTIPART_MESSAGE')<{
  multipartId: string;
  message: IMultipartMessage;
}>();
const removeMultipartData = createAction('MESSAGES/REMOVE_MULTIPART_DATA_ONE')<string>();

export const actions = {
  // fetchMessagesAsync,
  // updateStatusMessage,
  // removeMessageAsync,
  // clearMessagesAsync,
  init,
  clearError,
  addMultipartMessage,
  removeMultipartData,
  loadGlobalDataFromDisc,
  loadSuperDataFromDisc,
  clearSuperDataFromDisc,
  setLoadingData,
  setLoadingError,
  loadData,
};

export type MsgActionType = ActionType<typeof actions>;
