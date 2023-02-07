import { IFileSystem } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IFilePageParam } from '../../types';

const init = createAction('FILE/INIT')();
const clearError = createAction('FILE/CLEAR_ERROR')();
const setError = createAction('FILE/SET_ERROR')();

const fetchFilesAsync = createAsyncAction('FILE/FETCH__FILES', 'FILE/FETCH_FILES_SUCCESS', 'FILE/FETCH_FILES_FAILURE')<
  string | undefined,
  IFileSystem[],
  string
>();

const fetchFileAsync = createAsyncAction('FILE/FETCH_FILE', 'FILE/FETCH_FILE_SUCCESS', 'FILE/FETCH_FILE_FAILURE')<
  string | undefined,
  any,
  string
>();

const updateFileAsync = createAsyncAction('FILE/UPDATE_FILE', 'FILE/UPDATE_FILE_SUCCESS', 'FILE/UPDATE_FILE_FAILURE')<
  string | undefined,
  any,
  string
>();

const removeFileAsync = createAsyncAction('FILE/REMOVE_FILE', 'FILE/REMOVE_FILE_SUCCESS', 'FILE/REMOVE_FILE_FAILURE')<
  string | undefined,
  string,
  string
>();

const removeFilesAsync = createAsyncAction('FILE/REMOVE_MANY', 'FILE/REMOVE_MANY_SUCCESS', 'FILE/REMOVE_MANY_FAILURE')<
  string | undefined,
  string[],
  string
>();

const setPageParam = createAction('FILE/SET_PARAM')<IFilePageParam | undefined>();
const clearPageParams = createAction('FILE/CLEAR_PARAMS')();

export const fileSystemActions = {
  fetchFilesAsync,
  fetchFileAsync,
  updateFileAsync,
  removeFileAsync,
  removeFilesAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
  setError,
};

export type FileSystemActionType = ActionType<typeof fileSystemActions>;
