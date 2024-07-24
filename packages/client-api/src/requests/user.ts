import { AuthLogOut, IUser, NewUser } from '@lib/types';
import { user as mockUser, users as mockUsers } from '@lib/mock';

import { error, user as types, BaseApi, BaseRequest } from '../types';
import { generateId, response2Log, sleep } from '../utils';

import { CustomRequest } from '../robustRequest';

class User extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addUser = async (
    customRequest: CustomRequest,
    user: NewUser,
  ): Promise<error.IServerError | types.IAddUserResponse> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_USER',
        user: {
          ...user,
          id: generateId(),
          creator: mockUser,
          role: 'User',
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      };
    }

    const res = await customRequest<IUser>({
      api: this.api.axios,
      method: 'POST',
      url: '/users',
      data: user,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'ADD_USER',
        user: res.data,
      } as types.IAddUserResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'пользователь не создан',
    } as error.IServerError;
  };

  updateUser = async (customRequest: CustomRequest, user: Partial<IUser>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);
      const updatedUser = mockUsers.find((item) => item.id === user.id);

      if (updatedUser) {
        return {
          type: 'UPDATE_USER',
          user: { ...updatedUser, editionDate: new Date().toISOString() },
        } as types.IUpdateUserResponse;
      }

      return {
        type: 'ERROR',
        message: 'Пользователь не найден',
      } as error.IServerError;
    }

    const res = await customRequest<IUser>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/users/${user.id}`,
      data: user,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'UPDATE_USER',
        user: res.data,
      } as types.IUpdateUserResponse;
    }
    return {
      type: res.type,
      message: response2Log(res) || 'Пользователь не обновлен',
    } as error.IServerError;
  };

  removeUser = async (customRequest: CustomRequest, userId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/users/${userId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Пользователь не удален',
    } as error.IServerError;
  };

  getUser = async (customRequest: CustomRequest, userId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);
      const user = mockUsers.find((item) => item.id === userId);

      if (user) {
        return {
          type: 'GET_USER',
          user,
        } as types.IGetUserResponse;
      }

      return {
        type: 'ERROR',
        message: 'Данные о пользователе не получены',
      } as error.IServerError;
    }

    const res = await customRequest<IUser>({ api: this.api.axios, method: 'GET', url: `/users/${userId}` });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_USER',
        user: res.data,
      } as types.IGetUserResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о пользователе не получены',
    } as error.IServerError;
  };

  getUsers = async (customRequest: CustomRequest, params?: Record<string, string | number>, _authFunc?: AuthLogOut) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      if (mockUsers) {
        return {
          type: 'GET_USERS',
          users: mockUsers,
        } as types.IGetUsersResponse;
      }

      return {
        type: 'ERROR',
        message: 'Данные о пользователях не получены',
      } as error.IServerError;
    }

    const res = await customRequest<IUser[]>({ api: this.api.axios, method: 'GET', url: '/users', params });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_USERS',
        users: res.data,
      } as types.IGetUsersResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о пользователях не получены',
    } as error.IServerError;
  };
}
export default User;
