import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import Constants from 'expo-constants';

import { sleep, useSelector } from '@lib/store';

import Api from '@lib/client-api';
import { config } from '@lib/client-config';

import { data } from '../mock';

import { IMesPayload, IMesState } from './types';
import { mesActions } from './actions';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

export const fetchMes = (): ThunkAction<void, IMesState, unknown, AnyAction> => {
  return async (dispatch) => {
    //const response: IMesPayload = { data };
    const { company } = useSelector((state) => state.auth);

    dispatch(mesActions.fetchMessAsync.request(''));

    //await sleep(1000);
    const response = await api.message.getMessages(Constants.manifest.extra.SYSTEM_NAME, company?.id || 'gdmn');

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
