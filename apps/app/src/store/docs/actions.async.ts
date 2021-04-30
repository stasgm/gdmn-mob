import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { documents } from '../mock';

import { docActions } from './actions';
import { IDocState } from './types';

export const fetchDoc = (): ThunkAction<void, IDocState, unknown, AnyAction> => {
  return async (dispatch) => {
    const response = documents;

    dispatch(docActions.fetchDocsAsync.request(''));

    if (response) {
      return dispatch(docActions.fetchDocsAsync.success(response));
    }

    if (response === null) {
      return dispatch(docActions.fetchDocsAsync.success(response));
    }

    return dispatch(docActions.fetchDocsAsync.failure('something wrong'));
  };
};

export default { fetchDoc };
