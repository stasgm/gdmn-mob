import { IReference, IReferences } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { ReferenceState } from './types';

const init = createAction('REFERENCES/INIT')();
const deleteReference = createAction('REFERENCES/DELETE')<string>();
const clearError = createAction('REFERENCES/CLEAR_ERROR')();
const loadData = createAction('REFERENCES/LOAD_DATA')<ReferenceState>();
const setLoading = createAction('REFERENCES/SET_LOADING')<boolean>();
const setLoadingData = createAction('REFERENCES/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('REFERENCES/SET_LOADING_ERROR')<string>();

const setReferencesAsync = createAsyncAction(
  'REFERENCES/SET_ALL',
  'REFERENCES/SET_ALL_SUCCESS',
  'REFERENCES/SET_ALL_FAILURE',
)<string | undefined, IReferences, string>();

const setOneReferenceAsync = createAsyncAction(
  'REFERENCES/SET_ONE',
  'REFERENCES/SET_ONE_SUCCESS',
  'REFERENCES/SET_ONE_FAILURE',
)<string | undefined, { refName: string; refData: IReference }, string>();

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

export const actions = {
  addReferencesAsync,
  loadData,
  setReferencesAsync,
  setOneReferenceAsync,
  deleteReference,
  removeReferenceAsync,
  clearReferencesAsync,
  clearError,
  init,
  setLoading,
  setLoadingData,
  setLoadingError,
};

export type ReferenceActionType = ActionType<typeof actions>;
