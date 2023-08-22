import { DeviceState, IUser, IUserCredentials, NewAccessCode } from '@lib/types';
import { user as mockUser } from '@lib/mock';

import { error, auth as types } from '../types';
import { response2Log, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class Auth extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  signup = async (customRequest: CustomRequest, userCredentials: IUserCredentials) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SIGNUP',
        user: { ...mockUser, name: userCredentials.name },
      } as types.ISignUpResponse;
    }

    const body = {
      name: userCredentials.name,
      password: userCredentials.password,
      email: userCredentials.email,
    };

    const res = await customRequest<IUser>({
      api: this.api.axios,
      method: 'POST',
      url: '/auth/signup',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'SIGNUP',
      } as types.ISignUpResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Пользователь не создан',
    } as error.IServerError;
  };

  login = async (customRequest: CustomRequest, userCredentials: IUserCredentials) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      if (userCredentials.name === mockUser.name && userCredentials.password === mockUser.password) {
        return {
          type: 'LOGIN',
          user: mockUser,
        } as types.ILoginResponse;
      }
      return {
        type: 'ERROR',
        message: 'Вход пользователя не выполнен',
      } as error.IServerError;
    }

    const body = {
      name: userCredentials.name,
      password: userCredentials.password,
    };

    const res = await customRequest<IUser>({
      api: this.api.axios,
      method: 'POST',
      url: '/auth/login',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'LOGIN',
        user: res.data,
      } as types.ILoginResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Вход пользователя не выполнен',
    } as error.IServerError;
  };

  logout = async (customRequest: CustomRequest) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }

    const res = await customRequest<undefined>({
      api: this.api.axios,
      method: 'POST',
      url: '/auth/logout',
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }
    return {
      type: res.type,
      message: response2Log(res) || 'Выход из профиля не выполнен',
    } as error.IServerError;
  };

  getCurrentUser = async (customRequest: CustomRequest) => {
    const res = await customRequest<IUser>({ api: this.api.axios, method: 'GET', url: '/auth/user' });
    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_CURRENT_USER',
        user: res.data,
      } as types.IUserResponse;
    }
    return {
      type: res.type,
      message: response2Log(res) || 'Данные о пользователе не получены',
    } as error.IServerError;
  };

  verifyCode = async (customRequest: CustomRequest, code: string) => {
    const body = { code };

    const res = await customRequest<string>({
      api: this.api.axios,
      method: 'POST',
      url: '/auth/device/code',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'VERIFY_CODE',
        uid: res.data,
      } as types.IVerifyCodeResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Код активации не проверен',
    } as error.IServerError;
  };

  getDeviceStatus = async (customRequest: CustomRequest, uid: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICE_STATUS',
        status: 'ACTIVE',
      } as types.IDeviceStatusResponse; // активация устройства в mock
    }

    const res = await customRequest<DeviceState>({
      api: this.api.axios,
      method: 'GET',
      url: `/auth/deviceStatus/${uid}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICE_STATUS',
        status: res.data,
      } as types.IDeviceStatusResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Статус устройства не получен',
    } as error.IServerError;
  };

  verifyAccessCode = async (customRequest: CustomRequest, adminId: string, code: string) => {
    const body = { adminId, code };

    const res = await customRequest<string>({
      api: this.api.axios,
      method: 'POST',
      url: '/auth/user',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'VERIFY_ACCESS_CODE',
        code: res.data,
      } as types.IVerifyAccessCodeResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Код активации не проверен',
    } as error.IServerError;
  };

  createAccessCode = async (
    customRequest: CustomRequest,
    adminId: string,
  ): Promise<types.ICreateAccessCodeResponse | error.IServerError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      // const c = mockActivationCodes.find((a) => a.device.id === deviceId) || {
      //   code: '4444',
      //   device: { id: deviceId, name: 'iPhone' },
      //   id: '169',
      //   date: '2021-07-07T07:25:25.265Z',
      // };

      // return {
      //   type: 'CREATE_CODE',
      //   code: {
      //     ...c,
      //     code: '5555',
      //   },
      // };
    }

    const res = await customRequest<string>({
      api: this.api.axios,
      method: 'GET',
      url: `/users/${adminId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_ACCESS_CODE',
        code: res.data,
      } as types.ICreateAccessCodeResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Код активации не создан',
    } as error.IServerError;
  };
}

export default Auth;
