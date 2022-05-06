import api from '@lib/client-api';

import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, MsgActionType } from './actions';
import { MessagesState } from './types';

export type MsgDispatch = ThunkDispatch<MessagesState, any, MsgActionType>;

export const useMsgThunkDispatch = () => useDispatch<MsgDispatch>();

const fetchMessages = ({
  appSystemId,
  companyId,
}: {
  appSystemId: string;
  companyId: string;
}): AppThunk<
  Promise<ActionType<typeof actions.fetchMessagesAsync>>,
  MessagesState,
  ActionType<typeof actions.fetchMessagesAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.fetchMessagesAsync.request(''));

    const response = await api.message.getMessages({ appSystemId, companyId });

    if (response.type === 'GET_MESSAGES') {
      return dispatch(actions.fetchMessagesAsync.success(response.messageList));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.fetchMessagesAsync.failure(response.message));
    }

    return dispatch(actions.fetchMessagesAsync.failure('something wrong'));
  };
};

const clearMessages = (params: { appSystemId: string; companyId: string }): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.clearMessagesAsync.request('Удаление сообщений'));

    const response = await api.message.clear(params);

    if (response.type === 'CLEAR_MESSAGES') {
      return dispatch(actions.clearMessagesAsync.success());
    }

    return dispatch(actions.clearMessagesAsync.failure('Ошибка удаления сообщений'));
  };
};

export default { fetchMessages, clearMessages, useMsgThunkDispatch };
