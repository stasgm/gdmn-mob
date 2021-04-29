import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { sleep } from '@lib/store';

import { data } from '../mock';

import { IMesPayload, IMesState } from './types';
import { mesActions } from './actions';

export const fetchMes = (): ThunkAction<void, IMesState, unknown, AnyAction> => {
  return async (dispatch) => {
    const response: IMesPayload = { data };

    dispatch(mesActions.fetchMessAsync.request(''));

    await sleep(1000);

    if (response.data) {
      return dispatch(mesActions.fetchMessAsync.success(response.data));
    }

    if (response.data === null) {
      return dispatch(mesActions.fetchMessAsync.success(response.data));
    }

    return dispatch(mesActions.fetchMessAsync.failure(response.errorMessage || 'something wrong'));
  };
};

export default { fetchMes };
