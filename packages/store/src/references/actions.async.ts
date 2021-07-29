
import { IReferences } from '@lib/types';

import { AppThunk } from '../types';

import { actions } from './actions';

//export type AppThunk = ThunkAction<Promise<ReferenceActionType>, IReferenceState, null, ReferenceActionType>;

export const addReferences = (references: IReferences): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.addReferencesAsync.request('Добавление справочников'));

    try {
      return dispatch(actions.addReferencesAsync.success(references));
    } catch {
      return dispatch(actions.addReferencesAsync.failure('Ошибка добавления справочника'));
    }
  };
};

// <
//   Promise<ActionType<typeof actions.removeReferenceAsync>>,
//   ReferenceState,
//   ActionType<typeof actions.removeReferenceAsync>>

const removeReference = (documentId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.removeReferenceAsync.request('Удаление справочника'));

    try {
      return dispatch(actions.removeReferenceAsync.success(documentId));
    } catch {
      return dispatch(actions.removeReferenceAsync.failure('Ошибка удаления справочника'));
    }
  };
};

// <
//   Promise<ActionType<typeof actions.clearReferencesAsync>>,
//   ReferenceState,
//   ActionType<typeof actions.clearReferencesAsync>
// >

const clearReferences = (): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.clearReferencesAsync.request('Удаление справочников'));

    try {
      return dispatch(actions.clearReferencesAsync.success());
    } catch {
      return dispatch(actions.clearReferencesAsync.failure('Ошибка удаления справочников'));
    }
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

export default { addReferences, removeReference, clearReferences /*, addReference*/ };
