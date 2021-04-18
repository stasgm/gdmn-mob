import { AxiosInstance } from 'axios';
import { IDevice, IResponse, IUser, IUserCredentials } from '@lib/types';

import { error, auth as types } from '../types';
import { BaseApi } from '../requests/baseApi';

class Auth extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }
  /*   private deviceId: string;
    private readonly api: AxiosInstance;

    constructor(api: AxiosInstance, deviceId: string) {
      this.api = api;
      this.deviceId = deviceId;
    } */

  signup = async (name: string, password: string, companyId?: string, creatorId?: string) => {
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
    let res;
    try {
      const body = { uid: this.deviceId, code };

      res = await this.api.post<IResponse<IDevice>>('/auth/device/code', body);

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
        message: err?.response?.data?.error || 'ошибка подключения',
      } as error.INetworkError;
    }
  };
}

export default Auth;
