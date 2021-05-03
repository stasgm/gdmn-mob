import { AxiosInstance } from 'axios';
import { v4 as uuid } from 'uuid';

import { IResponse, IUser, NewUser, UserRole } from '@lib/types';
import { user as mockUser, users as mockUsers } from '@lib/mock';

import { error, user as types } from '../types';
import { BaseApi } from '../requests/baseApi';
import { sleep } from '../utils';

const isMock = process.env.MOCK;
const mockTimeout = 500;

class User extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addUser = async (user: NewUser) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'ADD_USER',
        user: { ...user, id: uuid(), creator: mockUser, role: 'User' },
      } as types.IAddUserResponse;
    }

    const res = await this.api.post<IResponse<IUser>>('/users', user);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'ADD_USER',
        user: resData.data,
      } as types.IAddUserResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  updateUser = async (user: Partial<IUser>) => {
    if (isMock) {
      await sleep(mockTimeout);
      const updatedUser = mockUsers.find((item) => item.id === user.id);

      if (updatedUser) {
        return {
          type: 'UPDATE_USER',
          user: updatedUser,
        } as types.IUpdateUserResponse;
      }

      return {
        type: 'ERROR',
        message: 'Пользоватль не найден',
      } as error.INetworkError;
    }

    const res = await this.api.patch<IResponse<IUser>>(`/users/${user.id}`, user);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'UPDATE_USER',
        user: resData.data,
      } as types.IUpdateUserResponse;
    }
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  removeUser = async (userId: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }

    const res = await this.api.delete<IResponse<void>>(`/users/${userId}`);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  getUser = async (userId: string) => {
    if (isMock) {
      await sleep(mockTimeout);
      const user = mockUsers.find((item) => item.id === userId);

      if (user) {
        return {
          type: 'GET_USER',
          user,
        } as types.IGetUserResponse;
      }

      return {
        type: 'ERROR',
        message: 'Пользователь не найден',
      } as error.INetworkError;
    }

    const res = await this.api.get<IResponse<IUser>>(`/users/${userId}`);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'GET_USER',
        user: resData.data,
      } as types.IGetUserResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  getUsers = async (params: Record<string, string>) => {
    if (isMock) {
      await sleep(mockTimeout);

      if (mockUsers) {
        return {
          type: 'GET_USERS',
          users: mockUsers,
        } as types.IGetUsersResponse;
      }

      return {
        type: 'ERROR',
        message: 'Пользователи не найдены',
      } as error.INetworkError;
    }

    const getParams = (params: Record<string, string>) => {
      return Object.entries(params).reduce((acc, [field, value]) => {
        let curParam = '';
        if (acc > '') {
          curParam = `${acc}&`;
        }
        return `${curParam}${field}=${value}`;
      }, '');
    };

    let paramText = getParams(params);

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    const res = await this.api.get<IResponse<IUser[]>>(`/users${paramText}`);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'GET_USERS',
        users: resData.data,
      } as types.IGetUsersResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };
}
export default User;
