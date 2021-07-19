import { IActivationCode, IResponse /*, NewAcivationCode*/ } from '@lib/types';
import { activationCodes as mockActivationCodes } from '@lib/mock';

import { error, activationCode as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class ActivationCode extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  /**
    * Получить
      - все устройства;
      - все устройства по параметрам;
    * @param params
    * @returns
    */

  fetchActivationCodes = async (
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
