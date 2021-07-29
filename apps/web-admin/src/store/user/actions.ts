import { IUser } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IPageParam } from '../../types';

const init = createAction('USER/INIT')();
const clearError = createAction('USER/CLEAR_ERROR')();

const fetchUsersAsync = createAsyncAction('USER/FETCH_USERS', 'USER/FETCH_USERS_SUCCESS', 'USER/FETCH_USERS_FAILURE')<
  string | undefined,
  IUser[],
  string
>();

const fetchUserAsync = createAsyncAction('USER/FETCH_USER', 'USER/FETCH_USER_SUCCESS', 'USER/FETCH_USER_FAILURE')<
  string | undefined,
  IUser,
  string
>();

const addUserAsync = createAsyncAction('USER/ADD', 'USER/ADD_SUCCESS', 'USER/ADD_FAILURE')<
  string | undefined,
  IUser,
  string
>();

const updateUserAsync = createAsyncAction('USER/UPDATE', 'USER/UPDATE_SUCCESS', 'USER/UPDATE_FAILURE')<
  string | undefined,
  IUser,
  string
>();

const removeUserAsync = createAsyncAction('USER/REMOVE', 'USER/REMOVE_SUCCESS', 'USER/REMOVE_FAILURE')<
  string | undefined,
  string,
  string
>();

const setPageParam = createAction('USER/SET_PARAM')<IPageParam>();
const clearPageParams = createAction('USER/CLEAR_PARAMS')();

export const userActions = {
  fetchUsersAsync,
  fetchUserAsync,
  addUserAsync,
  updateUserAsync,
  removeUserAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
};

export type UserActionType = ActionType<typeof userActions>;
