import { ThunkAction } from 'redux-thunk';

import { sleep } from '@lib/client-api';

import { IDocument, IDocState } from './types';

import { DocActionType, docActions } from './actions';

export type AppThunk = ThunkAction<Promise<DocActionType>, IDocState, null, DocActionType>;

export const fetchDoc = (): AppThunk => {
  return async (dispatch) => {
    const response: IDocument[] = [{ number: 6 }, { number: 2 }];

    dispatch(docActions.fetchDocsAsync.request(''));

    await sleep(1000);

    if (response) {
      return dispatch(docActions.fetchDocsAsync.success(response));
    }

    return dispatch(docActions.fetchDocsAsync.failure('something wrong'));
  };
};

export default { fetchDoc };
