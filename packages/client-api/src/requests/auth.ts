import { IResponse, IUser, IUserCredentials } from '@lib/common-types';

import { api, deviceId } from '../config';

import { INetworkError, authTypes as types } from '../types';

const signup = async (userName: string, password: string, companyId?: string, creatorId?: string) => {
  const body = {
    userName: userName,
    password: password,
    companies: companyId ? [companyId] : undefined,
    creatorId: creatorId ?? userName,
  };
  const res = await api.post<IResponse<string>>('/auth/signup', body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'SIGNUP',
      userId: resData.data,
    } as types.ISignUpResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

const login = async (userCredentials: IUserCredentials) => {
  const body = {
    userName: userCredentials.userName,
    password: userCredentials.password,
  };
  const res = await api.post<IResponse<string>>('/auth/login', body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'LOGIN',
      userId: resData.data,
    } as types.ILoginResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
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
  } as INetworkError;
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
  } as INetworkError;
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
  } as INetworkError;
};

const verifyCode = async (code: string) => {
  const body = { uid: deviceId, code };
  const res = await api.post<IResponse<string>>('/auth/device/code', body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'VERIFY_CODE',
      deviceUid: resData.data,
    } as types.IVerifyCodeResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
  getActivationCode,
  verifyCode,
};
