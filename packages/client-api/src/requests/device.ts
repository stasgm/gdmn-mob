import { AxiosInstance } from 'axios';
import { IDevice, IResponse } from '@lib/types';
import { device as mockDevice, devices as mockDevices } from '@lib/mock';

import { BaseApi } from '../requests/baseApi';
import { error, device as types } from '../types';
import { sleep } from '../utils';

const isMock = process.env.MOCK;
const mockTimeout = 500;

class Device extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addDevice = async (deviceName: string, userId: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'ADD_DEVICE',
        id: mockDevice.id,
      } as types.IAddDeviceResponse;
    }

    const body = {
      deviceName,
      userId,
    };

    const res = await this.api.post<IResponse<string>>('/devices', body);
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
  getDevices = async (userId?: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'GET_DEVICES',
        devices: mockDevices,
      } as types.IGetDevicesResponse;
    }

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
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'GET_DEVICE',
        device: mockDevice,
      } as types.IGetDeviceResponse;
    }

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
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'UPDATE_DEVICE',
        deviceId: device.id,
      } as types.IUpdateDeviceResponse;
    }

    const res = await this.api.patch<IResponse<string>>(`/devices/${device.id}`, device);
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

  removeDevice = async (deviceId: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'REMOVE_DEVICE',
      } as types.IRemoveDeviceResponse;
    }

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
