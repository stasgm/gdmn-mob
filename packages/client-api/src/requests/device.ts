import { IDevice, NewDevice } from '@lib/types';
import { device as mockDevice } from '@lib/mock';

import { error, device as types } from '../types';
import { generateId, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class Device extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDevice = async (customRequest: CustomRequest, newDevice: NewDevice) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICE',
        device: {
          ...newDevice,
          id: generateId(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddDeviceResponse;
    }

    const res = await customRequest<IDevice>({
      api: this.api.axios,
      method: 'POST',
      url: '/devices',
      data: newDevice,
    });

    if (res?.result) {
      return {
        type: 'ADD_DEVICE',
        device: res.data,
      } as types.IAddDeviceResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Устройство не создано',
    } as error.IServerError;
  };

  updateDevice = async (customRequest: CustomRequest, device: Partial<IDevice>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_DEVICE',
        device: { ...device, editionDate: new Date().toISOString() },
      } as types.IUpdateDeviceResponse;
    }

    const res = await customRequest<IDevice>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/devices/${device.id}`,
      data: device,
    });

    if (res?.result) {
      return {
        type: 'UPDATE_DEVICE',
        device: res.data,
      } as types.IUpdateDeviceResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Устройство не обновлено',
    } as error.IServerError;
  };

  removeDevice = async (customRequest: CustomRequest, deviceId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICE',
      } as types.IRemoveDeviceResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/devices/${deviceId}`,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_DEVICE',
      } as types.IRemoveDeviceResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Устройство не удалено',
    } as error.IServerError;
  };

  /**
    * Получить устройство (IDevice)
      - устройство по uid;
      - устройство по uid и по пользователю;
    * @param string deviceId
    * @param string userId
    * @returns IDevice
    */
  getDevice = async (customRequest: CustomRequest, deviceId?: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICE',
        device: mockDevice,
      } as types.IGetDeviceResponse;
    }

    const res = await customRequest<IDevice>({
      api: this.api.axios,
      method: 'GET',
      url: `/devices/${deviceId || this.api.config.deviceId}`,
    });

    if (res?.result) {
      return {
        type: 'GET_DEVICE',
        device: res.data,
      } as types.IGetDeviceResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Устройство не получено',
    } as error.IServerError;
  };

  /**
    * Получить
      - все устройства;
      - все устройства по параметрам;
    * @param params
    * @returns
    */
  getDevices = async (
    customRequest: CustomRequest,
    params?: Record<string, string | number>,
  ): Promise<types.IGetDevicesResponse | error.IServerError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICES',
        devices: [mockDevice],
      };
    }

    const res = await customRequest<IDevice[]>({ api: this.api.axios, method: 'GET', url: '/devices', params });

    if (res?.result) {
      return {
        type: 'GET_DEVICES',
        devices: res.data || [],
      } as types.IGetDevicesResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные об устройствах не получены',
    } as error.IServerError;
  };

  getUsersByDevice = async (customRequest: CustomRequest, deviceId: string) => {
    const res = await customRequest<IDevice[]>({
      api: this.api.axios,
      method: 'GET',
      url: `/devices/${deviceId}/users`,
    });

    if (res?.result) {
      return {
        type: 'GET_USERS_BY_DEVICE',
        userList: res.data,
      } as types.IGetUsersByDeviceResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные о пользователях по устройству не получены',
    } as error.IServerError;
  };
}

export default Device;
