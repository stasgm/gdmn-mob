import { DEVICE_ID, get, patch } from './http.service';
import { IResponse, IUser, IDevice } from '../../../common';
import { IUser as IUserType } from '../types';
import { IAllUsersResponse, INetworkError, IGetUserResponse, IUpdateUserResponse, IGetUserDevicesResponse } from '../queryTypes';

const getAllUsers = async () => {
  const res = await get<IResponse<IUser[]>>(`/users/?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'ALL_USERS',
      users: res.data //.map((r: any) => ({userId: r.id, userName: r.userName}))
    } as IAllUsersResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const getUser = async (userId: string) => {
  const res = await get<IResponse<IUser>>(`/users/${userId}?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'GET_USER',
      user: res.data
    } as IGetUserResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const updateUser = async (user: Partial<IUserType>) => {
  const body = JSON.stringify(user);
  const res = await patch<IResponse<IUser>>(`/users/${user.id}?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'UPDATE_USER'
    } as IUpdateUserResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const getUserDevices = async (userId: string) => {
  const res = await get<IResponse<IDevice[]>>(`/users/${userId}/devices?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'USER_DEVICES',
      devices: res.data
    } as unknown as IGetUserDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

export { getAllUsers, getUser, updateUser, getUserDevices };
