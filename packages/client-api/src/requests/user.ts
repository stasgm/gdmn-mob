import { AxiosInstance } from 'axios';
import { IResponse, IUser, NewUser } from '@lib/types';

import { error, user as types } from '../types';

import { BaseApi } from '../requests/baseApi';

class User extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addUser = async (newUser: NewUser) => {
    const res = await this.api.post<IResponse<IUser>>('/users', newUser);
    const userData = res.data;

    if (!userData.result || !userData.data) {
      return {
        type: 'ERROR',
        message: res.data.error,
      } as error.INetworkError;
    }

    return {
      type: 'ADD_USER',
      user: userData.data,
    } as types.IAddUserResponse;
  };

  getUsers = async () => {
    const res = await this.api.get<IResponse<IUser[]>>('/users');
    const userData = res.data;

    if (userData.result) {
      return {
        type: 'GET_USERS',
        users: userData.data,
      } as types.IGetUsersResponse;
    }
    return {
      type: 'ERROR',
      message: userData.error,
    } as error.INetworkError;
  };

  getUser = async (userId: string) => {
    const res = await this.api.get<IResponse<IUser>>(`/users/${userId}`);
    const userData = res.data;

    if (userData.result) {
      return {
        type: 'GET_USER',
        user: userData.data,
      } as types.IGetUserResponse;
    }
    return {
      type: 'ERROR',
      message: userData.error,
    } as error.INetworkError;
  };

  updateUser = async (user: Partial<IUser>) => {
    const res = await this.api.patch<IResponse<IUser>>(`/users/${user.id}`, user);
    const userData = res.data;

    if (userData.result) {
      return {
        type: 'UPDATE_USER',
        user: userData.data,
      } as types.IUpdateUserResponse;
    }
    return {
      type: 'ERROR',
      message: userData.error,
    } as error.INetworkError;
  };

  removeUser = async (userId: string) => {
    const res = await this.api.delete<IResponse<void>>(`/users/${userId}`);
    const userData = res.data;

    if (userData.result) {
      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }
    return {
      type: 'ERROR',
      message: userData.error,
    } as error.INetworkError;
  };
}

export default User;
