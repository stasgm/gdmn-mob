import { isDataView } from 'util/types';

import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { AppState } from '..';

import { fileSystemActions, FileSystemActionType } from './actions';

export type AppThunk = ThunkAction<Promise<FileSystemActionType>, AppState, null, FileSystemActionType>;

const fetchFiles = (): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFilesAsync.request(''));

    const params: Record<string, string | number> = {};

    // if (filterText) params.filterText = filterText;
    // if (fromRecord) params.fromRecord = fromRecord;
    // if (toRecord) params.toRecord = toRecord;

    const response = await api.file.getFiles(params);

    if (response.type === 'GET_FILES') {
      return dispatch(fileSystemActions.fetchFilesAsync.success(response.files));
    }

    if (response.type === 'ERROR') {
      return dispatch(fileSystemActions.fetchFilesAsync.failure(response.message));
    }

    return dispatch(fileSystemActions.fetchFilesAsync.failure('Ошибка получения данных о файлах'));
  };
};

const fetchFile = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.fetchFileAsync.request(''));

    const response = await api.file.getFile(id);

    if (response.type === 'GET_FILE') {
      return dispatch(fileSystemActions.fetchFileAsync.success(response.file));
    }

    if (response.type === 'ERROR') {
      return dispatch(fileSystemActions.fetchFileAsync.failure(response.message));
    }

    return dispatch(fileSystemActions.fetchFileAsync.failure('Ошибка получения данных о файле'));
  };
};

const updateFile = (id: string, file: any): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.updateFileAsync.request('Обновление файла'));

    const response = await api.file.updateFile(id, file);

    if (response.type === 'UPDATE_FILE') {
      return dispatch(fileSystemActions.updateFileAsync.success(response.file));
    }

    if (response.type === 'ERROR') {
      return dispatch(fileSystemActions.updateFileAsync.failure(response.message));
    }

    return dispatch(fileSystemActions.updateFileAsync.failure('Ошибка обновления файла'));
  };
};

const removeFile = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFileAsync.request(''));

    const response = await api.file.removeFile(id);

    if (response.type === 'REMOVE_FILE') {
      return dispatch(fileSystemActions.removeFileAsync.success(id));
    }

    if (response.type === 'ERROR') {
      return dispatch(fileSystemActions.removeFileAsync.failure(response.message));
    }

    return dispatch(fileSystemActions.removeFileAsync.failure('Ошибка получения данных о файле'));
  };
};

const removeFiles = (fileIds: string[]): AppThunk => {
  return async (dispatch) => {
    dispatch(fileSystemActions.removeFilesAsync.request(''));

    const response = await api.file.removeFiles(fileIds);

    if (response.type === 'REMOVE_FILES') {
      return dispatch(fileSystemActions.removeFilesAsync.success(fileIds));
    }

    if (response.type === 'ERROR') {
      return dispatch(fileSystemActions.removeFilesAsync.failure(response.message));
    }

    return dispatch(fileSystemActions.removeFilesAsync.failure('Ошибка получения данных о файлах'));
  };
};

export default { fetchFiles, fetchFile, updateFile, removeFile, removeFiles };
