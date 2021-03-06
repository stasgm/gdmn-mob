import { IDevice, IResponse, NewDevice } from '@lib/types';
import { device as mockDevice, devices as mockDevices } from '@lib/mock';

import { error, device as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class Device extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDevice = async (newDevice: NewDevice) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICE',
        device: mockDevice,
      } as types.IAddDeviceResponse;
    }

    try {
      const res = await this.api.axios.post<IResponse<IDevice>>('/devices', newDevice);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка добавления устройства',
      } as error.INetworkError;
    }
  };

  updateDevice = async (device: Partial<IDevice>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_DEVICE',
        device,
      } as types.IUpdateDeviceResponse;
    }

    try {
      const res = await this.api.axios.patch<IResponse<IDevice>>(`/devices/${device.id}`, device);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка обновления устройства',
      } as error.INetworkError;
    }
  };

  removeDevice = async (deviceId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICE',
      } as types.IRemoveDeviceResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/devices/${deviceId}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка удаления устройства',
      } as error.INetworkError;
    }
  };

  /**
    * Получить устройство (IDevice)
      - устройство по uid;
      - устройство по uid и по пользователю;
    * @param string deviceId
    * @param string userId
    * @returns IDevice
    */
  getDevice = async (deviceId?: string) => {
    // console.log('getDevice', JSON.stringify(this.api.config));
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICE',
        device: mockDevice,
      } as types.IGetDeviceResponse;
    }

    try {
      // || this.api.deviceId
      const res = await this.api.axios.get<IResponse<IDevice>>(`/devices/${deviceId || this.api.deviceId}`);

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

  /**
    * Получить
      - все устройства;
      - все устройства по параметрам;
    * @param params
    * @returns
    */
  getDevices = async (params?: Record<string, string>): Promise<types.IGetDevicesResponse | error.INetworkError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICES',
        devices: mockDevices,
      };
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDevice[]>>(`/devices${paramText}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_DEVICES',
          devices: resData?.data || [],
        };
      }
      return {
        type: 'ERROR',
        message: resData?.error || 'ошибка получения данных об устройствах',
      };
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка получения данных об устройствах',
      };
    }
  };

  getUsersByDevice = async (deviceId: string) => {
    try {
      const res = await this.api.axios.get<IResponse<IDevice[]>>(`/devices/${deviceId}/users`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка получения пользователей по устройству',
      } as error.INetworkError;
    }
  };
}

export default Device;
