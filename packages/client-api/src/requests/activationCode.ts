import { IActivationCode } from '@lib/types';
import { activationCodes as mockActivationCodes } from '@lib/mock';

import { error, activationCode as types } from '../types';
import { sleep } from '../utils';
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
  ): Promise<types.IGetCodesResponse | error.IServerError> => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_CODES',
        codes: mockActivationCodes,
      };
    }

    const res = await customRequest<IActivationCode[]>({ api: this.api.axios, method: 'GET', url: '/codes', params });

    if (res?.result) {
      return {
        type: 'GET_CODES',
        codes: res.data || [],
      } as types.IGetCodesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные об активационных кодах не получены',
    } as error.IServerError;
  };

  createActivationCode = async (
    customRequest: CustomRequest,
    deviceId: string,
  ): Promise<types.ICreateCodeResponse | error.IServerError> => {
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

    const res = await customRequest<IActivationCode>({
      api: this.api.axios,
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
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Код активации не создан',
    } as error.IServerError;
  };
}

export default ActivationCode;
