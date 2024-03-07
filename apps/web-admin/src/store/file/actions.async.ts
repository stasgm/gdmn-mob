import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { IFileParams } from '@lib/types';

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
  console.log('fetchFiles filesFilters', filesFilters);
  const params: Record<string, string | number> = filesFilters ? filesFilters : {};

  if (filterText) params.filterText = filterText;
  if (fromRecord) params.fromRecord = fromRecord;
  if (toRecord) params.toRecord = toRecord;

  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFilesAsync.request(''));
    console.log('params', params);
    const response = await api.file.getFiles(webRequest(dispatch, authActions), params);
    console.log('response', response);

    if (response.type === 'GET_FILES') {
      return dispatch(fileSystemActions.fetchFilesAsync.success(response.files));
    }

    return dispatch(fileSystemActions.fetchFilesAsync.failure(response.message));
  };
};

const fetchFile = (id: string, folder?: string, appSystemId?: string, companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFileAsync.request(''));

    const params: Record<string, string | number> = {};

    // if (ext) params.ext = ext;
    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.getFile(webRequest(dispatch, authActions), id, params);

    if (response.type === 'GET_FILE') {
      return dispatch(fileSystemActions.fetchFileAsync.success(response.file));
    }

    return dispatch(fileSystemActions.fetchFileAsync.failure(response.message));
  };
};

const updateFile = (
  id: string,
  file: any,
  // ext?: string,
  folder?: string,
  appSystemId?: string,
  companyId?: string,
): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.updateFileAsync.request('Обновление файла'));

    const params: Record<string, string | number> = {};

    // if (ext) params.ext = ext;
    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.updateFile(webRequest(dispatch, authActions), id, params, file);

    if (response.type === 'UPDATE_FILE') {
      return dispatch(fileSystemActions.updateFileAsync.success(response.file));
    }

    return dispatch(fileSystemActions.updateFileAsync.failure(response.message));
  };
};

const deleteFile = (id: string, folder?: string, appSystemId?: string, companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFileAsync.request(''));

    const params: Record<string, string | number> = {};

    // if (ext) params.ext = ext;
    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.deleteFile(webRequest(dispatch, authActions), id, params);

    if (response.type === 'REMOVE_FILE') {
      return dispatch(fileSystemActions.removeFileAsync.success(id));
    }

    return dispatch(fileSystemActions.removeFileAsync.failure(response.message));
  };
};

const deleteFiles = (fileIds: IFileParams[]): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFilesAsync.request(''));

    const response = await api.file.deleteFiles(webRequest(dispatch, authActions), fileIds);

    if (response.type === 'REMOVE_FILES') {
      return dispatch(fileSystemActions.removeFilesAsync.success(fileIds));
    }

    return dispatch(fileSystemActions.removeFilesAsync.failure(response.message));
  };
};

const moveFiles = (fileIds: IFileParams[], folderName: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.moveFilesAsync.request(''));

    console.log('fileIds', fileIds);
    const response = await api.file.moveFiles(webRequest(dispatch, authActions), fileIds, folderName);
    console.log('foldername', folderName);
    if (response.type === 'MOVE_FILES') {
      return dispatch(fileSystemActions.moveFilesAsync.success(fileIds));
    }

    return dispatch(fileSystemActions.moveFilesAsync.failure(response.message));
  };
};

const fetchFolders = (companyId: string, appSystemId: string): AppThunk => {
  const params: Record<string, string | number> = {};

  params.companyId = companyId;
  params.appSystemId = appSystemId;

  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFoldersAsync.request(''));

    const response = await api.file.getFolders(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_FOLDERS') {
      return dispatch(fileSystemActions.fetchFoldersAsync.success(response.folders));
    }

    return dispatch(fileSystemActions.fetchFoldersAsync.failure(response.message));
  };
};

export default { fetchFiles, fetchFile, updateFile, deleteFile, deleteFiles, moveFiles, fetchFolders };
