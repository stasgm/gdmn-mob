import { IDevice, IResponse, IUser, IUserCredentials } from '@lib/types';
import { device as mockDevice, user as mockUser } from '@lib/mock';

import { error, auth as types } from '../types';
import { sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class Auth extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  signup = async (userCredentials: IUserCredentials) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SIGNUP',
        user: { ...mockUser, name: userCredentials.name },
      } as types.ISignUpResponse;
    }

    const body = {
      name: userCredentials.name,
      password: userCredentials.name,
      // companies: companyId ? [companyId] : undefined,
      // creatorId: creatorId ?? name,
    };

    try {
      const res = await this.api.axios.post<IResponse<IUser>>('/auth/signup', body);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка создания пользователя',
      } as error.INetworkError;
    }
  };

  login = async (userCredentials: IUserCredentials) => {
    // console.log('login', JSON.stringify(this.api.config));
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

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
      const res = await this.api.axios.post<IResponse<IUser>>('/auth/login', body);
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
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'LOGOUT',
      } as types.ILogOutResponse;
    }

    try {
      const res = await this.api.axios.get<IResponse<undefined>>('/auth/logout');
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка выхода',
      } as error.INetworkError;
    }
  };

  getCurrentUser = async () => {
    try {
      const res = await this.api.axios.get<IResponse<IUser>>('/auth/user');

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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка получения данных о пользователе',
      } as error.INetworkError;
    }
  };

  getActivationCode = async () => {
    try {
      const res = await this.api.axios.get<IResponse<string>>(`/auth/device/${this.api.deviceId}/code`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка получения кода',
      } as error.INetworkError;
    }
  };

  verifyCode = async (code: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

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
      const body = { uid: this.api.deviceId, code };

      const res = await this.api.axios.post<IResponse<IDevice>>('/auth/device/code', body);

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
