import { IProcess, IResponse } from '@lib/types';

import { error, process as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
// import { IProcess } from '../types/process';

class Process extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getProcesses = async (params?: Record<string, string | number>) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     type: 'GET_COMPANIES',
    //     companies: mockCompanies,
    //   } as types.IGetCompaniesResponse;
    // }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IProcess[]>>(`/process${paramText}`);
      ///${this.api.config.version}
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_PROCESSES',
          processes: resData.data,
        } as types.IGetProcessesResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о процессах',
        //err?.response?.data?.error || 'ошибка получения данных о компаниях',
      } as error.INetworkError;
    }
  };

  removeProcess = async (processId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_PROCESS',
      } as types.IRemoveProcessResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/process/${processId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_PROCESS',
        } as types.IRemoveProcessResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления процесса',
        //err?.response?.data?.error || 'ошибка удаления компании',
      } as error.INetworkError;
    }
  };
}

export default Process;
