import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { AppState } from '..';

import { webRequest } from '../webRequest';

import { IFileFilter } from '../../types';

import { fileSystemActions, FileSystemActionType } from './actions';

export type AppThunk = ThunkAction<Promise<FileSystemActionType>, AppState, null, FileSystemActionType>;

const fetchFiles = (
  filesFilters?: IFileFilter,
  filterText?: string,
  fromRecord?: number,
  toRecord?: number,
): AppThunk => {
  const params: Record<string, string | number> = filesFilters ? filesFilters : {};

  if (filterText) params.filterText = filterText;
  if (fromRecord) params.fromRecord = fromRecord;
  if (toRecord) params.toRecord = toRecord;

  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFilesAsync.request(''));

    const response = await api.file.getFiles(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_FILES') {
      return dispatch(fileSystemActions.fetchFilesAsync.success(response.files));
    }

    return dispatch(fileSystemActions.fetchFilesAsync.failure(response.message));
  };
};

const fetchFile = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFileAsync.request(''));

    const response = await api.file.getFile(webRequest(dispatch, authActions), id);

    if (response.type === 'GET_FILE') {
      return dispatch(fileSystemActions.fetchFileAsync.success(response.file));
    }

    return dispatch(fileSystemActions.fetchFileAsync.failure(response.message));
  };
};

const updateFile = (id: string, file: any): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.updateFileAsync.request('Обновление файла'));

    const response = await api.file.updateFile(webRequest(dispatch, authActions), id, file);

    if (response.type === 'UPDATE_FILE') {
      return dispatch(fileSystemActions.updateFileAsync.success(response.file));
    }

    return dispatch(fileSystemActions.updateFileAsync.failure(response.message));
  };
};

const removeFile = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFileAsync.request(''));

    const response = await api.file.removeFile(webRequest(dispatch, authActions), id);

    if (response.type === 'REMOVE_FILE') {
      return dispatch(fileSystemActions.removeFileAsync.success(id));
    }

    return dispatch(fileSystemActions.removeFileAsync.failure(response.message));
  };
};

const removeFiles = (fileIds: string[]): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFilesAsync.request(''));

    const response = await api.file.removeFiles(webRequest(dispatch, authActions), fileIds);

    if (response.type === 'REMOVE_FILES') {
      return dispatch(fileSystemActions.removeFilesAsync.success(fileIds));
    }

    return dispatch(fileSystemActions.removeFilesAsync.failure(response.message));
  };
};

export default { fetchFiles, fetchFile, updateFile, removeFile, removeFiles };
