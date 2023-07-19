import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IFileSystemState } from './types';
import { FileSystemActionType, fileSystemActions } from './actions';

const initialState: Readonly<IFileSystemState> = {
  list: [],
  file: undefined,
  folders: [],
  loading: false,
  errorMessage: '',
  pageParams: undefined,
};

const reducer: Reducer<IFileSystemState, FileSystemActionType> = (state = initialState, action): IFileSystemState => {
  switch (action.type) {
    case getType(fileSystemActions.init):
      return initialState;

    case getType(fileSystemActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(fileSystemActions.setError):
      return { ...state, errorMessage: action.payload };

    case getType(fileSystemActions.fetchFilesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(fileSystemActions.fetchFilesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(fileSystemActions.fetchFilesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(fileSystemActions.fetchFileAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(fileSystemActions.fetchFileAsync.success):
      return {
        ...state,
        file: action.payload,
        // list: action.payload,
        loading: false,
      };

    case getType(fileSystemActions.fetchFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(fileSystemActions.updateFileAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(fileSystemActions.updateFileAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(fileSystemActions.updateFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(fileSystemActions.removeFileAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(fileSystemActions.removeFileAsync.success):
      return {
        ...state,
        list: state.list.filter((i) => i.id !== action.payload),
        loading: false,
      };

    case getType(fileSystemActions.removeFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(fileSystemActions.removeFilesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(fileSystemActions.removeFilesAsync.success):
      return {
        ...state,
        loading: false,
        list: state.list.filter((i) => action.payload.indexOf(i.id) === -1),
      };

    case getType(fileSystemActions.removeFilesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(fileSystemActions.moveFilesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(fileSystemActions.moveFilesAsync.success):
      return {
        ...state,
        loading: false,
        folders: [],
      };

    case getType(fileSystemActions.moveFilesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(fileSystemActions.fetchFoldersAsync.request):
      return { ...state, loading: true, folders: [], errorMessage: '' };

    case getType(fileSystemActions.fetchFoldersAsync.success):
      return {
        ...state,
        folders: action.payload,
        loading: false,
      };

    case getType(fileSystemActions.fetchFoldersAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(fileSystemActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(fileSystemActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
