import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { ISystemFileState } from './types';
import { SystemFileActionType, systemFileActions } from './actions';

const initialState: Readonly<ISystemFileState> = {
  list: [],
  file: undefined,
  folders: [],
  loading: false,
  errorMessage: '',
  pageParams: undefined,
};

const reducer: Reducer<ISystemFileState, SystemFileActionType> = (state = initialState, action): ISystemFileState => {
  switch (action.type) {
    case getType(systemFileActions.init):
      return initialState;

    case getType(systemFileActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(systemFileActions.setError):
      return { ...state, errorMessage: action.payload };

    case getType(systemFileActions.fetchFilesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(systemFileActions.fetchFilesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(systemFileActions.fetchFilesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(systemFileActions.fetchFileAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(systemFileActions.fetchFileAsync.success):
      return {
        ...state,
        file: action.payload,
        // list: action.payload,
        loading: false,
      };

    case getType(systemFileActions.fetchFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(systemFileActions.updateFileAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(systemFileActions.updateFileAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(systemFileActions.updateFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(systemFileActions.removeFileAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(systemFileActions.removeFileAsync.success):
      return {
        ...state,
        list: state.list.filter((i) => i.id !== action.payload),
        loading: false,
      };

    case getType(systemFileActions.removeFileAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(systemFileActions.removeFilesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(systemFileActions.removeFilesAsync.success):
      return {
        ...state,
        loading: false,
        list: state.list.filter((i) => action.payload.findIndex((fileObj) => fileObj.id === i.id) === -1),
      };

    case getType(systemFileActions.removeFilesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(systemFileActions.moveFilesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(systemFileActions.moveFilesAsync.success):
      return {
        ...state,
        loading: false,
        folders: [],
      };

    case getType(systemFileActions.moveFilesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(systemFileActions.fetchFoldersAsync.request):
      return { ...state, loading: true, folders: [], errorMessage: '' };

    case getType(systemFileActions.fetchFoldersAsync.success):
      return {
        ...state,
        folders: action.payload,
        loading: false,
      };

    case getType(systemFileActions.fetchFoldersAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(systemFileActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(systemFileActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    case getType(systemFileActions.clearFilesFilters):
      return {
        ...state,
        pageParams: undefined,
        list: [],
      };

    default:
      return state;
  }
};

export default reducer;
