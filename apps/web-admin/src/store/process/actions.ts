import { IProcess } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('PROCESSES/INIT')();
const clearError = createAction('PROCESSES/CLEAR_ERROR')();
const setError = createAction('APP_SYSTEM/SET_ERROR')();

const fetchProcessesAsync = createAsyncAction(
  'PROCESS/FETCH_PROCESSES',
  'PROCESS/FETCH_PROCESSES_SUCCESS',
  'PROCESS/FETCH_PROCESSES_FAILURE',
)<string | undefined, IProcess[], string>();

const fetchProcessAsync = createAsyncAction(
  'PROCESS/FETCH_PROCESS',
  'PROCESS/FETCH_PROCESS_SUCCESS',
  'PROCESS/FETCH_PROCESS_FAILURE',
)<string | undefined, IProcess, string>();

const removeProcessAsync = createAsyncAction('PROCESS/REMOVE', 'PROCESS/REMOVE_SUCCESS', 'PROCESS/REMOVE_FAILURE')<
  string | undefined,
  string,
  string
>();

export const processActions = {
  fetchProcessesAsync,
  fetchProcessAsync,
  removeProcessAsync,
  clearError,
  init,
  setError,
};

export type ProcessActionType = ActionType<typeof processActions>;
