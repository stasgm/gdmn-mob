import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IFileSystemState } from './types';
import { FileSystemActionType, fileSystemActions } from './actions';

const initialState: Readonly<IFileSystemState> = {
  list: [],
  file: undefined,
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
      return { ...state, errorMessage: 'Файл уже существует' };

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
