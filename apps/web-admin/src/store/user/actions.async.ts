import Api, { types, sleep } from '@lib/client-api';

import { users, user2 } from '@lib/mock';
import { config } from '@lib/client-config';

import { IUser, NewUser } from '@lib/types';

import { AppThunk } from '../';

import { userActions } from './actions';

/* const {
  debug: { useMockup: isMock },
} = config; */

const {
  debug: { useMockup: isMock, deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const fetchUserById = (id: string, onSuccess?: (user?: IUser) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.user.IGetUserResponse | types.error.INetworkError;

    dispatch(userActions.fetchUserAsync.request(''));

    if (isMock) {
      await sleep(1000);
      const user = users.find((item) => item.id === id);

      if (user) {
        response = { user: { ...user2, id }, type: 'GET_USER' };
      } else {
        response = { message: 'Пользователь не найден', type: 'ERROR' };
      }
    } else {
      response = await api.user.getUser(id);
    }

    if (response.type === 'GET_USER') {
      dispatch(userActions.fetchUserAsync.success(response.user));
      onSuccess?.(response.user);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(userActions.fetchUserAsync.failure(response.message));
      onSuccess?.();
      return;
    }

    dispatch(userActions.fetchUsersAsync.failure('something wrong'));
    return;
  };
};

const fetchUsers = (): AppThunk => {
  return async (dispatch) => {
    let response: types.user.IGetUsersResponse | types.error.INetworkError;

    dispatch(userActions.fetchUsersAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { users: users, type: 'GET_USERS' };
      // response = { message: 'device not found', type: 'ERROR' };
    } else {
      response = await api.user.getUsers();
    }

    if (response.type === 'GET_USERS') {
      dispatch(userActions.fetchUsersAsync.success(response.users));
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(userActions.fetchUsersAsync.failure(response.message));
      return;
    }

    dispatch(userActions.fetchUsersAsync.failure('something wrong'));
    return;
  };
};

const addUser = (user: NewUser, onSuccess?: (user: IUser) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.user.IAddUserResponse | types.error.INetworkError;

    dispatch(userActions.addUserAsync.request(''));

    if (isMock) {
      // await sleep(500);

      if (user.name === '1') {
        // Ошибка добавления пользователя
        response = { message: 'Пользователь с таким логином уже существует!', type: 'ERROR' };
      } else {
        // Добаляем пользователя
        response = { user: { ...user, ...user2 }, type: 'ADD_USER' };
      }
    } else {
      response = await api.user.addUser(user);
    }

    if (response.type === 'ADD_USER') {
      dispatch(userActions.addUserAsync.success(response.user));
      onSuccess?.(response.user);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(userActions.addUserAsync.failure(response.message));
      return;
    }

    dispatch(userActions.addUserAsync.failure('something wrong'));
    return;
  };
};

const updateUser = (user: IUser, onSuccess?: (user: IUser) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.user.IUpdateUserResponse | types.error.INetworkError;

    dispatch(userActions.updateUserAsync.request('обновление компании'));

    if (isMock) {
      await sleep(500);

      response = { type: 'UPDATE_USER', user };
    } else {
      response = await api.user.updateUser(user);
    }

    if (response.type === 'UPDATE_USER') {
      dispatch(userActions.updateUserAsync.success(response.user));
      onSuccess?.(response.user);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(userActions.updateUserAsync.failure(response.message));
      return;
    }

    dispatch(userActions.updateUserAsync.failure('something wrong'));
    return;
  };
};

export default { fetchUsers, fetchUserById, addUser, updateUser };
