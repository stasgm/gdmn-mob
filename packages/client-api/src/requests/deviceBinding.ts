import { IDeviceBinding, NewDeviceBinding } from '@lib/types';
import { deviceBinding as mockDeviceBinding, deviceBindings as mockDeviceBindings } from '@lib/mock';

import { error, deviceBinding as types, BaseApi, BaseRequest } from '../types';
import { generateId, response2Log, sleep } from '../utils';
import { CustomRequest } from '../robustRequest';

class DeviceBinding extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceBinding = async (customRequest: CustomRequest, newDeviceBinding: NewDeviceBinding) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICEBINDING',
        deviceBinding: {
          ...newDeviceBinding,
          id: generateId(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddDeviceBindingResponse;
    }

    const res = await customRequest<IDeviceBinding>({
      api: this.api.axios,
      method: 'POST',
      url: '/binding',
      data: newDeviceBinding,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'ADD_DEVICEBINDING',
        deviceBinding: res.data,
      } as types.IAddDeviceBindingResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Привязанное устройство не добавлено',
    } as error.IServerError;
  };

  updateDeviceBinding = async (customRequest: CustomRequest, deviceBinding: Partial<IDeviceBinding>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_DEVICEBINDING',
        deviceBinding: { ...deviceBinding, editionDate: new Date().toISOString() },
      } as types.IUpdateDeviceBindingResponse;
    }

    const res = await customRequest<IDeviceBinding>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/binding/${deviceBinding.id}`,
      data: deviceBinding,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'UPDATE_DEVICEBINDING',
        deviceBinding: res.data,
      } as types.IUpdateDeviceBindingResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Привязанное устройство не обновлено',
    } as error.IServerError;
  };

  removeDeviceBinding = async (customRequest: CustomRequest, deviceId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICEBINDING',
      } as types.IRemoveDeviceBindingResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/binding/${deviceId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_DEVICEBINDING',
      } as types.IRemoveDeviceBindingResponse;
    }
    return {
      type: res.type,
      message: response2Log(res) || 'Привязанное устройство не удалено',
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
  getDeviceBinding = async (customRequest: CustomRequest, deviceId?: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICEBINDING',
        deviceBinding: mockDeviceBinding,
      } as types.IGetDeviceBindingResponse;
    }

    const res = await customRequest<IDeviceBinding>({
      api: this.api.axios,
      method: 'GET',
      url: `/binding/${deviceId || this.api.config.deviceId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICEBINDING',
        deviceBinding: res.data,
      } as types.IGetDeviceBindingResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Связанное устройство не получено',
    } as error.IServerError;
  };

  /**
    * Получить
      - все устройства;
      - все устройства по параметрам;
    * @param params
    * @returns
    */
  getDeviceBindings = async (
    customRequest: CustomRequest,
    params?: Record<string, string | number>,
  ): Promise<types.IGetDeviceBindingsResponse | error.IServerError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICEBINDINGS',
        deviceBindings: mockDeviceBindings,
      } as types.IGetDeviceBindingsResponse;
    }

    const res = await customRequest<IDeviceBinding[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/binding',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICEBINDINGS',
        deviceBindings: res.data || [],
      } as types.IGetDeviceBindingsResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данныe об устройствах не получены',
    } as error.IServerError;
  };
}

export default DeviceBinding;
