import { ThunkAction } from 'redux-thunk';
// import Constants from 'expo-constants';

// import { useSelector } from '@lib/store';

import Api, { sleep } from '@lib/client-api';
// import { config } from '@lib/client-config';

import { IGetMessagesResponse } from '@lib/client-api/dist/src/types/message';
import { INetworkError } from '@lib/client-api/dist/src/types/error';

import { data } from '../mock';

import { AppState } from '../';

// import { IMesState } from './types';
import { mesActions, MesActionType } from './actions';

/*
const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config; */

// const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

export type AppThunk = ThunkAction<Promise<MesActionType>, AppState, null, MesActionType>;

export const fetchMes = (): AppThunk => {
  return async (dispatch) => {
    let response: IGetMessagesResponse | INetworkError;

    dispatch(mesActions.fetchMessAsync.request(''));

    //const response = await api.message.getMessages(Constants.manifest.extra.SYSTEM_NAME, company?.id || 'gdmn');
    //const response = await api.message.getMessages('Inventory', 'gdmn');
    const res = true;

    await sleep(500);
    if (res) {
      response = { type: 'GET_MESSAGES', messageList: data };
    } else {
      response = { type: 'ERROR', message: 'network error' };
    }

    if (response.type === 'GET_MESSAGES') {
      return dispatch(mesActions.fetchMessAsync.success(response.messageList));
    }

    if (response.type === 'ERROR') {
      return dispatch(mesActions.fetchMessAsync.failure(response.message));
    }

    return dispatch(mesActions.fetchMessAsync.failure('something wrong'));
  };
};

export default { fetchMes };
