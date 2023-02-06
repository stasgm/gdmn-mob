import { IMultipartMessage } from '@lib/types';
import { ActionType, createAction } from 'typesafe-actions';

import { MessagesState } from './types';

const init = createAction('MESSAGES/INIT')();
const clearSuperDataFromDisc = createAction('MESSAGES/CLEAR_SUPER_DATA_FROM_DISC')();
const setLoadingData = createAction('MESSAGES/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('MESSAGES/SET_LOADING_ERROR')<string>();
const loadData = createAction('MESSAGES/LOAD_DATA')<MessagesState>();
const addMultipartMessage = createAction('MESSAGES/ADD_MULTIPART_MESSAGE')<IMultipartMessage>();
const removeMultipartItem = createAction('MESSAGES/REMOVE_MULTIPART_ITEM_ONE')<string>();

export const actions = {
  init,
  setLoadingData,
  setLoadingError,
  loadData,
  clearSuperDataFromDisc,
  addMultipartMessage,
  removeMultipartItem,
};

export type MsgActionType = ActionType<typeof actions>;
