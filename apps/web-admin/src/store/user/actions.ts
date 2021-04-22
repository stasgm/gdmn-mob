import { IUser } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('USER/INIT')();
const clearError = createAction('USER/CLEAR_ERROR')();

const fetchUsersAsync = createAsyncAction('USER/FETCH_USERS', 'USER/FETCH_USERS_SUCCCES', 'USER/FETCH_USERS_FAILURE')<
  string | undefined,
  IUser[],
  string
>();

const fetchUserAsync = createAsyncAction('USER/FETCH_USER', 'USER/FETCH_USER_SUCCCES', 'USER/FETCH_USER_FAILURE')<
  string | undefined,
  IUser,
  string
>();

const addUserAsync = createAsyncAction('USER/ADD', 'USER/ADD_SUCCCES', 'USER/ADD_FAILURE')<
  string | undefined,
  IUser,
  string
>();

const updateUserAsync = createAsyncAction('USER/UPDATE', 'USER/UPDATE_SUCCCES', 'USER/UPDATE_FAILURE')<
  string | undefined,
  IUser,
  string
>();

export const userActions = {
  fetchUsersAsync,
  fetchUserAsync,
  addUserAsync,
  updateUserAsync,
  clearError,
  init,
};

export type UserActionType = ActionType<typeof userActions>;
