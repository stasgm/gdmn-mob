import { v4 as uuid } from 'uuid';
import { IActivationCode, IResponse /*, NewAcivationCode*/ } from '@lib/types';
import { activationCode as mockActivationCode, activationCodes as mockActivationCodes } from '@lib/mock';

import { error, activationCode as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class ActivationCode extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  /**
    * Получить устройство (IDevice)
      - устройство по uid;
      - устройство по uid и по пользователю;
    * @param string deviceId
    * @param string userId
    * @returns IDevice
    */
  getActivationCode = async (activationCodeId?: string) => {
    // console.log('getDevice', JSON.stringify(this.api.config));
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_ACTIVATION_CODE',
        activationCode: mockActivationCode,
      } as types.IGetActivationCodeResponse;
    }

    try {
      // || this.api.deviceId
      const res = await this.api.axios.get<IResponse<IActivationCode>>(
        `/activationCodes/${activationCodeId || this.api.activationCodeId}`,
      );

      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'GET_ACTIVATION_CODE',
          activationCode: resData.data,
        } as types.IGetActivationCodeResponse;
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

  getActivationCodes = async (
    params?: Record<string, string>,
  ): Promise<types.IGetActivationCodesResponse | error.INetworkError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_ACTIVATION_CODES',
        activationCodes: mockActivationCodes,
      };
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IActivationCode[]>>(`/activationCodes${paramText}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_ACTIVATION_CODES',
          activationCodes: resData?.data || [],
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
}

export default ActivationCode;
