import { IReferences } from '@lib/types';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';

import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, ReferenceActionType } from './actions';
import { ReferenceState } from './types';

export type RefDispatch = ThunkDispatch<ReferenceState, any, ReferenceActionType>;

export const useRefThunkDispatch = () => useDispatch<RefDispatch>();

export const setReferences = (
  references: IReferences,
): AppThunk<
  Promise<ActionType<typeof actions.setReferencesAsync>>,
  ReferenceState,
  ActionType<typeof actions.setReferencesAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setReferencesAsync.request(''));

    try {
      return dispatch(actions.setReferencesAsync.success(references));
    } catch {
      return dispatch(actions.setReferencesAsync.failure('Ошибка записи справочников'));
    }
  };
};

export const addReferences = (
  references: IReferences,
): AppThunk<
  Promise<ActionType<typeof actions.addReferencesAsync>>,
  ReferenceState,
  ActionType<typeof actions.addReferencesAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.addReferencesAsync.request('Добавление справочников'));

    try {
      return dispatch(actions.addReferencesAsync.success(references));
    } catch {
      return dispatch(actions.addReferencesAsync.failure('Ошибка добавления справочника'));
    }
  };
};

const removeReference = (
  documentId: string,
): AppThunk<
  Promise<ActionType<typeof actions.removeReferenceAsync>>,
  ReferenceState,
  ActionType<typeof actions.removeReferenceAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.removeReferenceAsync.request('Удаление справочника'));

    try {
      return dispatch(actions.removeReferenceAsync.success(documentId));
    } catch {
      return dispatch(actions.removeReferenceAsync.failure('Ошибка удаления справочника'));
    }
  };
};

const clearReferences = (): AppThunk<
  Promise<ActionType<typeof actions.clearReferencesAsync>>,
  ReferenceState,
  ActionType<typeof actions.clearReferencesAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.clearReferencesAsync.request('Удаление справочников'));

    try {
      return dispatch(actions.clearReferencesAsync.success());
    } catch {
      return dispatch(actions.clearReferencesAsync.failure('Ошибка удаления справочников'));
    }
  };
};

export default {
  setReferences,
  addReferences,
  removeReference,
  clearReferences,
  useRefThunkDispatch,
};
