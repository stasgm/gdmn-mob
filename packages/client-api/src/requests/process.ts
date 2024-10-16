import { IProcess } from '@lib/types';
import { processes as mockProcesses } from '@lib/mock';

import { error, process as types } from '../types';
import { response2Log, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class Process extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getProcesses = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_PROCESSES',
        processes: mockProcesses,
      } as types.IGetProcessesResponse;
    }

    const res = await customRequest<IProcess[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/processes',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_PROCESSES',
        processes: res.data,
      } as types.IGetProcessesResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о процессах не получены',
    } as error.IServerError;
  };

  removeProcess = async (customRequest: CustomRequest, processId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_PROCESS',
      } as types.IRemoveProcessResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/processes/${processId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_PROCESS',
      } as types.IRemoveProcessResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Процесс не удален',
    } as error.IServerError;
  };
}

export default Process;
