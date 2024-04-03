import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { IFileParams } from '@lib/types';

import { AppState } from '..';

import { webRequest } from '../webRequest';

import { IFileFilter } from '../../types';

import { systemFileActions, SystemFileActionType } from './actions';

export type AppThunk = ThunkAction<Promise<SystemFileActionType>, AppState, null, SystemFileActionType>;

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
    dispatch(systemFileActions.fetchFilesAsync.request(''));
    const response = await api.file.getFiles(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_FILES') {
      return dispatch(systemFileActions.fetchFilesAsync.success(response.files));
    }

    return dispatch(systemFileActions.fetchFilesAsync.failure(response.message));
  };
};

const fetchFile = (id: string, folder?: string, appSystemId?: string, companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(systemFileActions.fetchFileAsync.request(''));

    const params: Record<string, string | number> = {};

    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.getFile(webRequest(dispatch, authActions), id, params);

    if (response.type === 'GET_FILE') {
      return dispatch(systemFileActions.fetchFileAsync.success(response.file));
    }

    return dispatch(systemFileActions.fetchFileAsync.failure(response.message));
  };
};

const updateFile = (id: string, file: any, folder?: string, appSystemId?: string, companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(systemFileActions.updateFileAsync.request('Обновление файла'));

    const params: Record<string, string | number> = {};

    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.updateFile(webRequest(dispatch, authActions), id, params, file);

    if (response.type === 'UPDATE_FILE') {
      return dispatch(systemFileActions.updateFileAsync.success(response.file));
    }

    return dispatch(systemFileActions.updateFileAsync.failure(response.message));
  };
};

const deleteFile = (id: string, folder?: string, appSystemId?: string, companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(systemFileActions.removeFileAsync.request(''));

    const params: Record<string, string | number> = {};

    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.file.deleteFile(webRequest(dispatch, authActions), id, params);

    if (response.type === 'REMOVE_FILE') {
      return dispatch(systemFileActions.removeFileAsync.success(id));
    }

    return dispatch(systemFileActions.removeFileAsync.failure(response.message));
  };
};

const deleteFiles = (fileIds: IFileParams[]): AppThunk => {
  return async (dispatch) => {
    dispatch(systemFileActions.removeFilesAsync.request(''));

    const response = await api.file.deleteFiles(webRequest(dispatch, authActions), fileIds);

    if (response.type === 'REMOVE_FILES') {
      return dispatch(systemFileActions.removeFilesAsync.success(fileIds));
    }

    return dispatch(systemFileActions.removeFilesAsync.failure(response.message));
  };
};

const moveFiles = (fileIds: IFileParams[], folderName: string): AppThunk => {
  return async (dispatch) => {
    dispatch(systemFileActions.moveFilesAsync.request(''));

    const response = await api.file.moveFiles(webRequest(dispatch, authActions), fileIds, folderName);

    if (response.type === 'MOVE_FILES') {
      return dispatch(systemFileActions.moveFilesAsync.success(fileIds));
    }

    return dispatch(systemFileActions.moveFilesAsync.failure(response.message));
  };
};

const fetchFolders = (companyId: string, appSystemId: string): AppThunk => {
  const params: Record<string, string | number> = {};

  params.companyId = companyId;
  params.appSystemId = appSystemId;

  return async (dispatch) => {
    dispatch(systemFileActions.fetchFoldersAsync.request(''));

    const response = await api.file.getFolders(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_FOLDERS') {
      return dispatch(systemFileActions.fetchFoldersAsync.success(response.folders));
    }

    return dispatch(systemFileActions.fetchFoldersAsync.failure(response.message));
  };
};

export default { fetchFiles, fetchFile, updateFile, deleteFile, deleteFiles, moveFiles, fetchFolders };
