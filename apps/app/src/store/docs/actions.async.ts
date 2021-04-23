import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { docActions } from './actions';
import { IDocPayload, IDocState } from './types';

export const fetchDoc = (): ThunkAction<void, IDocState, unknown, AnyAction> => {
  return async (dispatch) => {
    const response: IDocPayload = { docData: [{ number: 6 }, { number: 2 }] };

    dispatch(docActions.fetchDocsAsync.request(''));

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
