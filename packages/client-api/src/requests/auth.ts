import { IDevice, IResponse, IUser, IUserCredentials } from '@lib/types';

import { api, deviceId } from '../config';

import { error, auth as types } from '../types';

const signup = async (userName: string, password: string, companyId?: string, creatorId?: string) => {
  const body = {
    userName,
    password,
    companies: companyId ? [companyId] : undefined,
    creatorId: creatorId ?? userName,
  };
  const res = await api.post<IResponse<IUser>>('/auth/signup', body);
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

const login = async (userCredentials: IUserCredentials) => {
  const body = {
    userName: userCredentials.userName,
    password: userCredentials.password,
  };
  const res = await api.post<IResponse<IUser>>('/auth/login', body);
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
};

const logout = async () => {
  const res = await api.get<IResponse<undefined>>('/auth/logout');
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

const getCurrentUser = async () => {
  const res = await api.get<IResponse<IUser>>('/auth/user');

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

const getActivationCode = async () => {
  const res = await api.get<IResponse<string>>(`/auth/device/${deviceId}/code`);
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

const verifyCode = async (code: string) => {
  let res;
  try {
    const body = { uid: deviceId, code };

    res = await api.post<IResponse<IDevice>>('/auth/device/code', body);

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

export default {
  signup,
  login,
  logout,
  getCurrentUser,
  getActivationCode,
  verifyCode,
};
