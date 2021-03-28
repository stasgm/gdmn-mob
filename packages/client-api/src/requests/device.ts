import { IDevice, IResponse } from '@lib/types';

import { INetworkError, deviceTypes } from '../types';

import { api } from '../config';

const addDevice = async (deviceName: string, userId: string) => {
  const body = {
    deviceName,
    userId,
  };
  const res = await api.post<IResponse<string>>('/devices', body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'ADD_DEVICE',
      id: resData.data,
    } as deviceTypes.IAddDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};
/**
  * Получить
    - все устройства;
    - все устройства по пользователю;
  * @param userId
  * @returns
  */
const getDevices = async (userId?: string) => {
  const res = await api.get<IResponse<IDevice[]>>(`/devices?${userId ? `userId=${userId}` : ''}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_DEVICES',
      devices: resData.data,
    } as deviceTypes.IGetDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

/**
  * Получить
    - устройство по id;
    - устройство по id и по пользователю;
  * @param userId
  * @returns
  */
const getDevice = async (deviceId: string, userId?: string) => {
  const res = await api.get<IResponse<IDevice>>(`/devices/${deviceId}${userId ? `userId=${userId}` : ''}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_DEVICE',
      device: resData.data,
    } as deviceTypes.IGetDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

const getUsersByDevice = async (deviceId: string) => {
  const res = await api.get<IResponse<IDevice[]>>(`/devices/${deviceId}/users`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_USERS_BY_DEVICE',
      userList: resData.data,
    } as deviceTypes.IGetUsersByDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

const updateDevice = async (device: Partial<IDevice>) => {
  const res = await api.patch<IResponse<string>>(`/devices/${device.id}`, device);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'UPDATE_DEVICE',
      deviceId: resData.data,
    } as deviceTypes.IUpdateDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

const removeDevice = async (deviceId: string) => {
  const res = await api.delete<IResponse<void>>(`/devices/${deviceId}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'REMOVE_DEVICE',
    } as deviceTypes.IRemoveDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as INetworkError;
};

export default {
  addDevice,
  getDevices,
  getDevice,
  getUsersByDevice,
  updateDevice,
  removeDevice,
};
