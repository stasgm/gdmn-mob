import { AxiosInstance } from 'axios';
import { IDevice, IResponse, NewDevice } from '@lib/types';

import { BaseApi } from '../requests/baseApi';

import { error, device as types } from '../types';

class Device extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addDevice = async (newDevice: NewDevice) => {
    const res = await this.api.post<IResponse<IDevice>>('/devices', newDevice);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'ADD_DEVICE',
        device: resData.data,
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
  getDevices = async (userId?: string) => {
    const res = await this.api.get<IResponse<IDevice[]>>(`/devices?${userId ? `userId=${userId}` : ''}`);
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
  getDevice = async (deviceId: string, userId?: string) => {
    try {
      const paramQuery = userId ? `?userId=${userId}` : '';

      const res = await this.api.get<IResponse<IDevice>>(`/devices/${deviceId || this.deviceId}${paramQuery}`);

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

  getUsersByDevice = async (deviceId: string) => {
    const res = await this.api.get<IResponse<IDevice[]>>(`/devices/${deviceId}/users`);
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

  updateDevice = async (device: Partial<IDevice>) => {
    const res = await this.api.patch<IResponse<IDevice>>(`/devices/${device.id}`, device);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'UPDATE_DEVICE',
        device: resData.data,
      } as types.IUpdateDeviceResponse;
    }
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  removeDevice = async (deviceId: string) => {
    const res = await this.api.delete<IResponse<void>>(`/devices/${deviceId}`);
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
}

export default Device;
