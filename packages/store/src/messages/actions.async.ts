import { ThunkAction } from 'redux-thunk';

import { config } from '@lib/client-config';

import Api from '@lib/client-api';

import { MsgActionType, actions } from './actions';
import { IMessagesState } from './types';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

type AppThunk = ThunkAction<Promise<MsgActionType>, IMessagesState, null, MsgActionType>;

const fetchMsg = ({ systemId, companyId }: { systemId: string; companyId: string }): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.fetchMsgAsync.request(''));

    const response = await api.message.getMessages({ systemId, companyId });

    if (response.type === 'GET_MESSAGES') {
      return dispatch(actions.fetchMsgAsync.success(response.messageList));
    }

    if (response.type === 'ERROR') {
      return dispatch(actions.fetchMsgAsync.failure(response.message));
    }

    return dispatch(actions.fetchMsgAsync.failure('something wrong'));
  };
};

export default { fetchMsg };
