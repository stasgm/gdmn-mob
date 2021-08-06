import { IReferences } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('REFERENCES/INIT')();
// const setList = createAction('REFERENCES/UPDATE_LIST')<IReferences>();
const deleteReference = createAction('REFERENCES/DELETE')<string>();
const deleteAllReferences = createAction('REFERENCES/DELETE_ALL')();
const clearError = createAction('REFERENCES/CLEAR_ERROR')();

/*const addReferencesAsync = createAsyncAction(
  'REFERENCES/ADD_MANY',
  'REFERENCES/ADD_MANY_SUCCESS',
  'REFERENCES/ADD_MANY_FAILURE',
)<string | undefined, IReferences, string>();*/

const setReferencesAsync = createAsyncAction(
  'REFERENCES/SET_ALL',
  'REFERENCES/SET_ALL_SUCCESS',
  'REFERENCES/SET_ALL_FAILURE',
)<string | undefined, IReferences, string>();

const addReferencesAsync = createAsyncAction('REFERENCES/ADD', 'REFERENCES/ADD_SUCCESS', 'REFERENCES/ADD_FAILURE')<
  string | undefined,
  IReferences,
  string
>();

const removeReferenceAsync = createAsyncAction(
  'REFERENCES/REMOVE_REFERENCE',
  'REFERENCES/REMOVE_REFERENCE_SUCCESS',
  'REFERENCES/REMOVE_REFERENCE_FAILURE',
)<string | undefined, string, string>();

const clearReferencesAsync = createAsyncAction(
  'REFERENCES/CLEAR_REFERENCES',
  'REFERENCES/CLEAR_REFERENCES_SUCCESS',
  'REFERENCES/CLEAR_REFERENCES_FAILURE',
)<string | undefined, undefined, string>();

/*const addReferenceAsync = createAsyncAction(
  'REFERENCES/ADD_ONE',
  'REFERENCES/ADD_ONE_SUCCESS',
  'REFERENCES/ADD_ONE_FAILURE',
)<string | undefined, IReferences, string>();*/

export const actions = {
  addReferencesAsync,
  //addReferenceAsync,
  setReferencesAsync,
  deleteReference,
  deleteAllReferences,
  removeReferenceAsync,
  clearReferencesAsync,
  clearError,
  init,
};

export type ReferenceActionType = ActionType<typeof actions>;
