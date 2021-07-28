import api from '@lib/client-api';
import { IMessage } from '@lib/types';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions } from './actions';
import { MessagesState } from './types';

//type AppThunk = ThunkAction<Promise<MsgActionType>, MessagesState, null, MsgActionType>;

const fetchMessages = ({ systemId, companyId }: { systemId: string; companyId: string }):  AppThunk<
  Promise<ActionType<typeof actions.fetchMessagesAsync>>,
  MessagesState,
  ActionType<typeof actions.fetchMessagesAsync>> => {
  return async (dispatch) => {
    dispatch(actions.fetchMessagesAsync.request(''));

    const response = await api.message.getMessages({ systemName: systemId, companyId });

    if (response.type === 'GET_MESSAGES') {
      return dispatch(actions.fetchMessagesAsync.success(response.messageList));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.fetchMessagesAsync.failure(response.message));
    }

    return dispatch(actions.fetchMessagesAsync.failure('something wrong'));
  };
};
const addMessages = (messages: IMessage[]): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.fetchMessagesAsync.request('Создание сообщения'));

    if (messages) {
      return dispatch(actions.fetchMessagesAsync.success(messages));
    }

    return dispatch(actions.fetchMessagesAsync.failure('Ошибка создания сообщения'));
  };
};
// AppThunk<
//   Promise<ActionType<typeof actions.removeMessageAsync>>,
//   MessagesState,
//   ActionType<typeof actions.removeMessageAsync>>
const removeMessage = (
  messageId: string,
): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.removeMessageAsync.request('Удаление сообщения'));

    const response = await api.message.removeMessage(messageId);

    if (response.type === 'REMOVE_MESSAGE') {
      return dispatch(actions.removeMessageAsync.success(messageId));
    }

    return dispatch(actions.removeMessageAsync.failure('Ошибка удаления сообщения'));
  };
};
// <
//   Promise<ActionType<typeof actions.clearMessagesAsync>>,
//   MessagesState,
//   ActionType<typeof actions.clearMessagesAsync>
// >

const clearMessages = (): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.clearMessagesAsync.request('Удаление сообщений'));

    const response = await api.message.clear();

    if (response.type === 'CLEAR_MESSAGES') {
      return dispatch(actions.clearMessagesAsync.success());
    }

    return dispatch(actions.clearMessagesAsync.failure('Ошибка удаления сообщений'));
  };
};

export default { addMessages, fetchMessages, removeMessage, clearMessages };
