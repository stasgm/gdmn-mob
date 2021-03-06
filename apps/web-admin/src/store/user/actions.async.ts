import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';
import { IUser, NewUser } from '@lib/types';

import { AppState } from '../';

import { userActions, UserActionType } from './actions';

export type AppThunk = ThunkAction<Promise<UserActionType>, AppState, null, UserActionType>;

const fetchUserById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(userActions.fetchUserAsync.request(''));

    const response = await api.user.getUser(id);

    if (response.type === 'GET_USER') {
      return dispatch(userActions.fetchUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(userActions.fetchUserAsync.failure(response.message));
    }

    return dispatch(userActions.fetchUsersAsync.failure('something wrong'));
  };
};

const fetchUsers = (companyId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(userActions.fetchUsersAsync.request(''));

    const response = await api.user.getUsers(companyId ? { companyId: companyId } : undefined);

    if (response.type === 'GET_USERS') {
      return dispatch(userActions.fetchUsersAsync.success(response.users));
    }

    if (response.type === 'ERROR') {
      return dispatch(userActions.fetchUsersAsync.failure(response.message));
    }

    return dispatch(userActions.fetchUsersAsync.failure('something wrong'));
  };
};

const addUser = (user: NewUser): AppThunk => {
  return async (dispatch) => {
    dispatch(userActions.addUserAsync.request(''));

    const response = await api.user.addUser(user);

    if (response.type === 'ADD_USER') {
      return dispatch(userActions.addUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(userActions.addUserAsync.failure(response.message));
    }

    return dispatch(userActions.addUserAsync.failure('something wrong'));
  };
};

const updateUser = (user: IUser): AppThunk => {
  return async (dispatch) => {
    dispatch(userActions.updateUserAsync.request('обновление пользователя'));

    const response = await api.user.updateUser(user);

    if (response.type === 'UPDATE_USER') {
      return dispatch(userActions.updateUserAsync.success(response.user));
    }

    if (response.type === 'ERROR') {
      return dispatch(userActions.updateUserAsync.failure(response.message));
    }

    return dispatch(userActions.updateUserAsync.failure('something wrong'));
  };
};

const removeUser = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(userActions.removeUserAsync.request('Удаление пользователя'));

    const response = await api.user.removeUser(id);

    if (response.type === 'REMOVE_USER') {
      return dispatch(userActions.removeUserAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(userActions.removeUserAsync.failure(response.message));
    }

    return dispatch(userActions.removeUserAsync.failure('Ошибка удаления компании'));
  };
};

export default { fetchUsers, fetchUserById, addUser, updateUser, removeUser };
