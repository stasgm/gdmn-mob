import { ThunkAction } from 'redux-thunk';

import { sleep } from '@lib/client-api';
import { IReferences } from '@lib/types';

import { actions, ReferenceActionType } from './actions';
import { IReferenceState } from './types';

export type AppThunk = ThunkAction<Promise<ReferenceActionType>, IReferenceState, null, ReferenceActionType>;

export const addReferences = (references: IReferences): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.addReferencesAsync.request(''));

    await sleep(1000);

    //TODO: проверка
    if (references) {
      return dispatch(actions.addReferencesAsync.success(references));
    }

    return dispatch(actions.addReferencesAsync.failure('something wrong'));
  };
};

/*export const addReference = (reference: IReference): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.addReferenceAsync.request(''));

    await sleep(1000);

    //TODO: проверка
    if (reference) {
      return dispatch(actions.addReferenceAsync.success(reference));
    }

    return dispatch(actions.addReferenceAsync.failure('something wrong'));
  };
};*/

export default { addReferences /*, addReference*/ };
