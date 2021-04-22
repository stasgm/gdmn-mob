import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IUserState } from './types';
import { UserActionType, userActions } from './actions';

const initialState: Readonly<IUserState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IUserState, UserActionType> = (state = initialState, action): IUserState => {
  switch (action.type) {
    case getType(userActions.init):
      return initialState;

    case getType(userActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(userActions.fetchUsersAsync.request):
      return { ...state, loading: true, list: [] };

    case getType(userActions.fetchUsersAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(userActions.fetchUsersAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(userActions.addUserAsync.request):
      return { ...state, loading: true };

    case getType(userActions.addUserAsync.success):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
        loading: false,
      };

    case getType(userActions.addUserAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Обновление компании
    case getType(userActions.updateUserAsync.request):
      return { ...state, loading: true };

    case getType(userActions.updateUserAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(userActions.updateUserAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Получение компании
    case getType(userActions.fetchUserAsync.request):
      return { ...state, loading: true };

    case getType(userActions.fetchUserAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(userActions.fetchUserAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };
    default:
      return state;
  }
};

export default reducer;
