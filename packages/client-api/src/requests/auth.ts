import { AxiosInstance } from 'axios';
import { IDevice, IResponse, IUser, IUserCredentials } from '@lib/types';
import { device as mockDevice, user as mockUser } from '@lib/mock';

import { error, auth as types } from '../types';
import { BaseApi } from '../requests/baseApi';
import { sleep } from '../utils';

const isMock = process.env.MOCK;
const mockTimeout = 500;

class Auth extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  signup = async (name: string, password: string, companyId?: string, creatorId?: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'SIGNUP',
        user: { ...mockUser, name },
      } as types.ISignUpResponse;
    }

    const body = {
      name: name,
      password,
      companies: companyId ? [companyId] : undefined,
      creatorId: creatorId ?? name,
    };

    const res = await this.api.post<IResponse<IUser>>('/auth/signup', body);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'SIGNUP',
        user: resData.data,
      } as types.ISignUpResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  login = async (userCredentials: IUserCredentials) => {
    if (isMock) {
      await sleep(mockTimeout);

      if (userCredentials.name === 'Stas' && userCredentials.password === '@123!') {
        return {
          type: 'LOGIN',
          user: mockUser,
        } as types.ILoginResponse;
      }
      return {
        type: 'ERROR',
        message: 'Неверные данные',
      } as error.INetworkError;
    }

    const body = {
      name: userCredentials.name,
      password: userCredentials.password,
    };

    try {
      const res = await this.api.post<IResponse<IUser>>('/auth/login', body);
      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'LOGIN',
          user: resData?.data,
        } as types.ILoginResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка подключения',
      } as error.INetworkError;
    }
  };

  logout = async () => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }

    const res = await this.api.get<IResponse<undefined>>('/auth/logout');
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  getCurrentUser = async () => {
    const res = await this.api.get<IResponse<IUser>>('/auth/user');

    const resData = res.data;
    if (resData.result) {
      return {
        type: 'GET_CURRENT_USER',
        user: resData.data,
      } as types.IUserResponse;
    }
    if (!resData.result) {
      return {
        type: 'USER_NOT_AUTHENTICATED',
      } as types.IUserNotAuthResponse;
    }
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  getActivationCode = async () => {
    const res = await this.api.get<IResponse<string>>(`/auth/device/${this.deviceId}/code`);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'GET_CODE',
        code: resData.data,
      } as types.ICreateCodeResponse;
    }
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  verifyCode = async (code: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      if (code === '1234') {
        return {
          type: 'VERIFY_CODE',
          device: mockDevice,
        } as types.IVerifyCodeResponse;
      }
      return {
        type: 'ERROR',
        message: 'Неверный код',
      } as error.INetworkError;
    }

    try {
      const body = { uid: this.deviceId, code };

      const res = await this.api.post<IResponse<IDevice>>('/auth/device/code', body);

      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'VERIFY_CODE',
          device: resData?.data,
        } as types.IVerifyCodeResponse;
      }

      return {
        type: 'ERROR',
        message: resData?.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'Ошибка подключения',
      } as error.INetworkError;
    }
  };
}

export default Auth;
