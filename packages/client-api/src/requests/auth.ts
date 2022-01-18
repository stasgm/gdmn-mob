import { DeviceState, IResponse, IUser, IUserCredentials } from '@lib/types';
import { user as mockUser } from '@lib/mock';

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
      password: userCredentials.password,
      email: userCredentials.email,
      // companies: companyId ? [companyId] : undefined,
      // creatorId: creatorId ?? name,
    };

    try {
      const res = await this.api.axios.post<IResponse<IUser>>('/auth/signup', body);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'SIGNUP',
          //user: resData.data,
        } as types.ISignUpResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка создания пользователя',
        //err?.response?.data?.error || 'ошибка создания пользователя',
      } as error.INetworkError;
    }
  };

  login = async (userCredentials: IUserCredentials) => {
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
        message: err instanceof TypeError ? err.message : 'ошибка подключения',
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
      const res = await this.api.axios.post<IResponse<undefined>>('/auth/logout');
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
        message: err instanceof TypeError ? err.message : 'ошибка выхода',
      } as error.INetworkError;

      // return {
      //   type: 'ERROR',
      //   message: err?.response?.data?.error || 'ошибка выхода',
      // } as error.INetworkError;
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
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о пользователе',
        //err?.response?.data?.error || 'ошибка получения данных о пользователе',
      } as error.INetworkError;
    }
  };

  // getActivationCode = async () => {
  //   try {
  //     const res = await this.api.axios.get<IResponse<string>>(`/auth/device/${this.api.deviceId}/code`);
  //     const resData = res.data;

  //     if (resData.result) {
  //       return {
  //         type: 'GET_CODE',
  //         code: resData.data,
  //       } as types.ICreateCodeResponse;
  //     }
  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err?.response?.data?.error || 'ошибка получения кода',
  //     } as error.INetworkError;
  //   }
  // };

  verifyCode = async (code: string) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);
    //   if (code === '1111') {
    //     console.log('verifyCode code', code, mockDevice);
    //     return {
    //       type: 'VERIFY_CODE',
    //       uid: mockDevice.uid,
    //     } as types.IVerifyCodeResponse;
    //   }
    //   return {
    //     type: 'ERROR',
    //     message: 'Неверный код',
    //   } as error.INetworkError;
    // }

    try {
      const body = { code };

      const res = await this.api.axios.post<IResponse<string>>('/auth/device/code', body);

      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'VERIFY_CODE',
          uid: resData?.data,
        } as types.IVerifyCodeResponse;
      }

      return {
        type: 'ERROR',
        message: resData?.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка подключения',
      } as error.INetworkError;
    }
  };

  getDeviceStatus = async (uid: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICE_STATUS',
        status: 'ACTIVE',
      } as types.IDeviceStatusResponse; // активация устройства в mock
    }

    try {
      const res = await this.api.axios.get<IResponse<DeviceState>>(`/auth/deviceStatus/${uid}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_DEVICE_STATUS',
          status: resData.data,
        } as types.IDeviceStatusResponse;
      }
      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения статуса устройства',
        //err?.response?.data?.error || 'ошибка получения статуса устройства',
      } as error.INetworkError;
    }
  };
}

export default Auth;
