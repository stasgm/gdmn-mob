import { DeviceState, IUser, IUserCredentials } from '@lib/types';
import { user as mockUser } from '@lib/mock';

import { error, auth as types } from '../types';
import { sleep } from '../utils';
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

    if (res?.result) {
      return {
        type: 'SIGNUP',
      } as types.ISignUpResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'пользователь не создан',
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
        message: 'вход пользователя не выполнен',
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

    if (res?.result) {
      return {
        type: 'LOGIN',
        user: res.data,
      } as types.ILoginResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'вход пользователя не выполнен',
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

    if (res?.result) {
      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'выход из профиля не выполнен',
    } as error.IServerError;
  };

  getCurrentUser = async (customRequest: CustomRequest) => {
    const res = await customRequest<IUser>({ api: this.api.axios, method: 'GET', url: '/auth/user' });
    if (res?.result) {
      return {
        type: 'GET_CURRENT_USER',
        user: res.data,
      } as types.IUserResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'данные о пользователе не получены',
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

    if (res?.result) {
      return {
        type: 'VERIFY_CODE',
        uid: res.data,
      } as types.IVerifyCodeResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'невереный код активации',
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

    if (res?.result) {
      return {
        type: 'GET_DEVICE_STATUS',
        status: res.data,
      } as types.IDeviceStatusResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'статус устройства не получен',
    } as error.IServerError;
  };
}

export default Auth;
