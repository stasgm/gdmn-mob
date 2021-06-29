import { IDeviceBinding, IResponse, NewDeviceBinding } from '@lib/types';
import { deviceBinding as mockDeviceBinding, deviceBindings as mockDeviceBindings } from '@lib/mock';

import { error, deviceBinding as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class DeviceBinding extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceBinding = async (newDeviceBinding: NewDeviceBinding) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICEBINDING',
        deviceBinding: mockDeviceBinding,
      } as types.IAddDeviceBindingResponse;
    }

    try {
      const res = await this.api.axios.post<IResponse<IDeviceBinding>>('/binding', newDeviceBinding);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'ADD_DEVICEBINDING',
          deviceBinding: resData.data,
        } as types.IAddDeviceBindingResponse;
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

  updateDeviceBinding = async (deviceBinding: Partial<IDeviceBinding>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_DEVICEBINDING',
        deviceBinding,
      } as types.IUpdateDeviceBindingResponse;
    }

    try {
      const res = await this.api.axios.patch<IResponse<IDeviceBinding>>(`/binding/${deviceBinding.id}`, deviceBinding);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'UPDATE_DEVICEBINDING',
          deviceBinding: resData.data,
        } as types.IUpdateDeviceBindingResponse;
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

  removeDeviceBinding = async (deviceId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICEBINDING',
      } as types.IRemoveDeviceBindingResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/devices/${deviceId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_DEVICEBINDING',
        } as types.IRemoveDeviceBindingResponse;
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
  getDeviceBinding = async (deviceId?: string) => {
    // console.log('getDevice', JSON.stringify(this.api.config));
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICEBINDING',
        deviceBinding: mockDeviceBinding,
      } as types.IGetDeviceBindingResponse;
    }

    try {
      // || this.api.deviceId
      const res = await this.api.axios.get<IResponse<IDeviceBinding>>(`/devices/${deviceId || this.api.deviceId}`);

      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'GET_DEVICEBINDING',
          deviceBinding: resData.data,
        } as types.IGetDeviceBindingResponse;
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
  getDeviceBindings = async (
    params?: Record<string, string>,
  ): Promise<types.IGetDeviceBindingsResponse | error.INetworkError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICEBINDINGS',
        deviceBindings: mockDeviceBindings,
      };
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDeviceBinding[]>>(`/devices${paramText}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_DEVICEBINDINGS',
          deviceBindings: resData?.data || [],
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

  // getUsersByDevice = async (deviceId: string) => {
  //   try {
  //     const res = await this.api.axios.get<IResponse<IDeviceBinding[]>>(`/devices/${deviceId}/users`);
  //     const resData = res.data;

  //     if (resData.result) {
  //       return {
  //         type: 'GET_USERS_BY_DEVICE',
  //         userList: resData.data,
  //       } as types.IGetUsersByDeviceResponse;
  //     }
  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err?.response?.data?.error || 'ошибка получения пользователей по устройству',
  //     } as error.INetworkError;
  //   }
  // };
}

export default DeviceBinding;
