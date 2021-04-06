import { IDevice, IResponse } from '@lib/types';

import { error, device as types } from '../types';

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
    } as types.IAddDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
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
    } as types.IGetDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

/**
  * Получить устройство (IDevice)
    - устройство по uid;
    - устройство по uid и по пользователю;
  * @param string deviceId
  * @param string userId
  * @returns IDevice
  */
const getDevice = async (deviceId: string, userId?: string) => {
  let res;
  try {
    const paramQuery = userId ? `?userId=${userId}` : '';

    res = await api.get<IResponse<IDevice>>(`/devices/${deviceId}${paramQuery}`);

    const resData = res?.data;

    if (resData?.result) {
      return {
        type: 'GET_DEVICE',
        device: resData.data,
      } as types.IGetDeviceResponse;
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

const getUsersByDevice = async (deviceId: string) => {
  const res = await api.get<IResponse<IDevice[]>>(`/devices/${deviceId}/users`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_USERS_BY_DEVICE',
      userList: resData.data,
    } as types.IGetUsersByDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const updateDevice = async (device: Partial<IDevice>) => {
  const res = await api.patch<IResponse<string>>(`/devices/${device.id}`, device);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'UPDATE_DEVICE',
      deviceId: resData.data,
    } as types.IUpdateDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const removeDevice = async (deviceId: string) => {
  const res = await api.delete<IResponse<void>>(`/devices/${deviceId}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'REMOVE_DEVICE',
    } as types.IRemoveDeviceResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

export default {
  addDevice,
  getDevices,
  getDevice,
  getUsersByDevice,
  updateDevice,
  removeDevice,
};
