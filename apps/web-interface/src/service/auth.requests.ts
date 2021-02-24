import { DEVICE_ID, get, post } from './http.service';
import { IResponse, IUser } from '../../../common';
import { IUserResponse, IUserNotAuthResponse, INetworkError, ILoginResponse, ISignUpResponse, ICreateCodeResponse, ILogOutResponse } from '../queryTypes';

const getCurrentUser = async () => {
    const res = await get<IResponse<IUser>>(`/auth/user?deviceId=${DEVICE_ID}`);

    if (res.result) {
      return {
        type: 'USER',
        user: res.data
      } as IUserResponse;
    }
    if (!res.result) {
      return {
        type: 'USER_NOT_AUTHENTICATED'
      } as IUserNotAuthResponse;
    }
    return {
      type: 'ERROR',
      message: res.error
    } as INetworkError;
};

const login = async (userName: string, password: string) => {
  const body = JSON.stringify({
    userName,
    password
  });
    const res = await post<IResponse<undefined>>(`/auth/login?deviceId=${DEVICE_ID}`, body);

    if (res.result) {
      return {
        type: 'LOGIN',
        userId: userName
      } as ILoginResponse;
    }
    return {
      type: 'ERROR',
      message: res.error
    } as INetworkError;
};

const signup = async (userName: string, password: string, companyId?: string, creatorId?: string) => {
  const body = JSON.stringify({
    userName: userName,
    password: password,
    companies: companyId ? [companyId] : undefined,
    creatorId: creatorId?? userName
  });
  const res = await post<IResponse<string>>(`/auth/signup?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'SIGNUP',
      userId: res.data
    } as ISignUpResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const createCode = async (deviceId: string) => {
  const res = await get<IResponse<string>>(`/auth/device/${deviceId}/code`);

  if (res.result) {
    return {
      type: 'USER_CODE',
      code: res.data
    } as ICreateCodeResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const logout = async () => {
  const res = await get<IResponse<undefined>>(`/auth/logout?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'LOGOUT',
    } as ILogOutResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

export { getCurrentUser, login, signup, logout, createCode };
