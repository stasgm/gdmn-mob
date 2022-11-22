import { AuthLogOut, IResponse, IUser, NewUser } from '@lib/types';
import { user as mockUser, users as mockUsers } from '@lib/mock';

import { error, user as types } from '../types';
import { generateId, getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';

import { BaseRequest } from '../types/BaseRequest';
import { RobustRequest, robustRequest } from '../robustRequest';

class User extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addUser = async (user: NewUser): Promise<error.INetworkError | types.IAddUserResponse> => {
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

    try {
      const res = await this.api.axios.post<IResponse<IUser>>('/users', user);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'ADD_USER',
          user: resData.data,
        } as types.IAddUserResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка добавления пользователя',
      };
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка добавления пользователя',
      };
    }
  };

  updateUser = async (user: Partial<IUser>) => {
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
      } as error.INetworkError;
    }

    try {
      const res = await this.api.axios.patch<IResponse<IUser>>(`/users/${user.id}`, user);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка обновления пользователя',
      } as error.INetworkError;
    }
  };

  removeUser = async (userId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_USER',
      } as types.IRemoveUserResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/users/${userId}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления пользователя',
      } as error.INetworkError;
    }
  };

  getUser = async (userId: string, authFunc?: AuthLogOut) => {
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
        message: 'Пользователь не найден',
      } as error.INetworkError;
    }

    const res = await robustRequest({ api: this.api, method: 'GET', url: `/users/${userId}` });
    // const res = await this.api.axios.get<IResponse<IUser>>(`/users/${userId}`);
    console.log('res', res);

    if (res.result === 'OK') {
      return {
        type: 'GET_USER',
        user: res.response.data?.data,
      } as types.IGetUserResponse;
    }

    return {
      type: 'ERROR',
      message: res.result === 'INVALID_DATA' || res.result === 'ERROR' ? res.message : 'ошибка добавления пользователя',
    } as error.INetworkError;
  };

  getUsers = async (params?: Record<string, string | number>, authFunc?: AuthLogOut) => {
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
        message: 'Пользователи не найдены',
      } as error.INetworkError;
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IUser[]>>(`/users${paramText}`);
      const resData = res.data;

      if (authFunc && resData.status === 401) {
        await authFunc();
      }

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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о пользователях',
      } as error.INetworkError;
    }
  };
}
export default User;
