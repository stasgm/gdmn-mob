import { IActivationCode, IResponse } from '@lib/types';
import { activationCodes as mockActivationCodes } from '@lib/mock';

import { error, activationCode as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

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

  getActivationCodes = async (
    customRequest: CustomRequest,
    params?: Record<string, string>,
  ): Promise<types.IGetCodesResponse | error.INetworkError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_CODES',
        codes: mockActivationCodes,
      };
    }

    // let paramText = params ? getParams(params) : '';

    // if (paramText > '') {
    //   paramText = `?${paramText}`;
    // }

    // try {
    //   const res = await this.api.axios.get<IResponse<IActivationCode[]>>(`/codes${paramText}`);
    //   const resData = res.data;
    const res = await customRequest<IActivationCode[]>({ api: this.api, method: 'GET', url: '/codes', params });

    if (res?.result) {
      return {
        type: 'GET_CODES',
        codes: res.data || [],
      } as types.IGetCodesResponse;
    }
    return {
      type: 'ERROR',
      message: res?.error || 'данные об активационных кодах не получены',
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err instanceof TypeError ? err.message : 'ошибка получения данных об активационных кодах',
    //     //err?.response?.data?.error || 'ошибка получения данных об активационных кодах',
    //   } as error.INetworkError;
    // }
  };

  createActivationCode = async (
    customRequest: CustomRequest,
    deviceId: string,
  ): Promise<types.ICreateCodeResponse | error.INetworkError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      const c = mockActivationCodes.find((a) => a.device.id === deviceId) || {
        code: '4444',
        device: { id: deviceId, name: 'iPhone' },
        id: '169',
        date: '2021-07-07T07:25:25.265Z',
      };

      return {
        type: 'CREATE_CODE',
        code: {
          ...c,
          code: '5555',
        },
      };
    }

    // try {
    //   const res = await this.api.axios.get<IResponse<IActivationCode>>(`/codes/device/${deviceId}/code`);
    //   const resData = res.data;
    const res = await customRequest<IActivationCode>({
      api: this.api,
      method: 'GET',
      url: `/codes/device/${deviceId}/code`,
    });

    if (res?.result) {
      return {
        type: 'CREATE_CODE',
        code: res.data,
      } as types.ICreateCodeResponse;
    }
    return {
      type: 'ERROR',
      message: res?.error || 'код не создан',
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err instanceof TypeError ? err.message : 'ошибка создания кода',
    //     //err?.response?.data?.error || 'ошибка создания кода',
    //   } as error.INetworkError;
    // }
  };
}

export default ActivationCode;
