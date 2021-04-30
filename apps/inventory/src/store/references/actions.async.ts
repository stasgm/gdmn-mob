import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { sleep } from '@lib/store';

import { refActions } from './actions';
import { IRefPayload, IRefState } from './types';

export const fetchRef = (): ThunkAction<void, IRefState, unknown, AnyAction> => {
  return async (dispatch) => {
    const response: IRefPayload = { data: [{ name: 'Магазины' }, { name: 'Товары' }] };

    dispatch(refActions.fetchRefsAsync.request(''));

    await sleep(1000);

    if (response.data) {
      return dispatch(refActions.fetchRefsAsync.success(response.data));
    }

    if (response.data === null) {
      return dispatch(refActions.fetchRefsAsync.success(response.data));
    }

    return dispatch(refActions.fetchRefsAsync.failure(response.errorMessage || 'something wrong'));
  };
};

export default { fetchRef };
