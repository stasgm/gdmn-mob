import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { sleep } from '@lib/store';

import { docActions } from './actions';
import { IDocPayload, IDocState } from './types';
import { documentData } from './mock';

export const fetchDoc = (): ThunkAction<void, IDocState, unknown, AnyAction> => {
  return async (dispatch) => {
    const response: IDocPayload = { docData: documentData };

    dispatch(docActions.fetchDocsAsync.request(''));

    await sleep(1000);

    if (response.docData) {
      return dispatch(docActions.fetchDocsAsync.success(response.docData));
    }

    if (response.docData === null) {
      return dispatch(docActions.fetchDocsAsync.success(response.docData));
    }

    return dispatch(docActions.fetchDocsAsync.failure(response.errorMessage || 'something wrong'));
  };
};

export default { fetchDoc };
