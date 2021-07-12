import { ThunkAction } from 'redux-thunk';

import api from '@lib/client-api';
import { IMessage } from '@lib/types';

import { MsgActionType, actions } from './actions';
import { IMessagesState } from './types';

type AppThunk = ThunkAction<Promise<MsgActionType>, IMessagesState, null, MsgActionType>;

const fetchMessages = ({ systemId, companyId }: { systemId: string; companyId: string }): AppThunk => {
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
    dispatch(actions.fetchMessagesAsync.request(''));

    //TODO: проверка
    if (messages) {
      return dispatch(actions.fetchMessagesAsync.success(messages));
    }

    return dispatch(actions.fetchMessagesAsync.failure('something wrong'));
  };
};

export default { addMessages, fetchMessages };
