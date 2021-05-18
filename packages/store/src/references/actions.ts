import { IReferences } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('REFERENCES/INIT')();
const updateList = createAction('REFERENCES/UPDATE_LIST')<IReferences>();
const deleteReference = createAction('REFERENCES/DELETE')<string>();
const deleteAllReferences = createAction('REFERENCES/DELETE_ALL')();
const clearError = createAction('REFERENCES/CLEAR_ERROR')();

/*const addReferencesAsync = createAsyncAction(
  'REFERENCES/ADD_MANY',
  'REFERENCES/ADD_MANY_SUCCCES',
  'REFERENCES/ADD_MANY_FAILURE',
)<string | undefined, IReferences, string>();*/

const addReferencesAsync = createAsyncAction('REFERENCES/ADD', 'REFERENCES/ADD_SUCCCES', 'REFERENCES/ADD_FAILURE')<
  string | undefined,
  IReferences,
  string
>();

/*const addReferenceAsync = createAsyncAction(
  'REFERENCES/ADD_ONE',
  'REFERENCES/ADD_ONE_SUCCCES',
  'REFERENCES/ADD_ONE_FAILURE',
)<string | undefined, IReferences, string>();*/

export const actions = {
  addReferencesAsync,
  //addReferenceAsync,
  updateList,
  deleteReference,
  deleteAllReferences,
  clearError,
  init,
};

export type ReferenceActionType = ActionType<typeof actions>;
