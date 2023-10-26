import { IFileObject, IFileSystem } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IFilePageParam } from '../../types';

const init = createAction('FILE/INIT')();
const clearError = createAction('FILE/CLEAR_ERROR')();
const setError = createAction('FILE/SET_ERROR')<string>();

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
  IFileObject[],
  string
>();

const moveFilesAsync = createAsyncAction('FILE/MOVE_MANY', 'FILE/MOVE_MANY_SUCCESS', 'FILE/MOVE_MANY_FAILURE')<
  string | undefined,
  IFileObject[],
  string
>();

const fetchFoldersAsync = createAsyncAction('FILE/GET_FOLDERS', 'FILE/GET_FOLDERS_SUCCESS', 'FILE/GET_FOLDERS_FAILURE')<
  string | undefined,
  string[],
  string
>();

const setPageParam = createAction('FILE/SET_PARAM')<IFilePageParam | undefined>();
const clearPageParams = createAction('FILE/CLEAR_PARAMS')();

const clearFilesFilters = createAction('FILE/CLEAR_FILES_FILTERS')();

export const fileSystemActions = {
  fetchFilesAsync,
  fetchFileAsync,
  updateFileAsync,
  removeFileAsync,
  removeFilesAsync,
  moveFilesAsync,
  fetchFoldersAsync,
  clearPageParams,
  setPageParam,
  clearError,
  clearFilesFilters,
  init,
  setError,
};

export type FileSystemActionType = ActionType<typeof fileSystemActions>;
