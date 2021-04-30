import { ThunkAction } from 'redux-thunk';

import { sleep } from '@lib/client-api';

import { refActions, RefActionType } from './actions';
import { IReference, IRefState } from './types';

export type AppThunk = ThunkAction<Promise<RefActionType>, IRefState, null, RefActionType>;

export const fetchRef = (): AppThunk => {
  return async (dispatch) => {
    const response: IReference[] = [{ name: 'Магазины' }, { name: 'Товары' }];

    dispatch(refActions.fetchRefsAsync.request(''));

    await sleep(1000);

    if (response) {
      return dispatch(refActions.fetchRefsAsync.success(response));
    }

    return dispatch(refActions.fetchRefsAsync.failure('something wrong'));
  };
};

export default { fetchRef };
