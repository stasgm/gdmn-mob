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

  apiOne = async ({ systemName, processId }: { systemName: string; processId: string }) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     status: 'STARTED',
    //     dateBegin: new Date(),
    //     id: '1111',
    //     idDb: '11111',
    //     processedMessages: [],
    //     messages: [],
    //   } as types.IProcess;
    // }

    try {
      const res = await this.api.axios.get<IResponse<IProcess[]>>(`/process/${processId}/${systemName}`);
      const resData = res.data;

      // if (resData.result) {
      //   return {
      //     status: 'STARTED',
      //     messageList: resData.data,
      //   } as types.IProcess;
      // }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения сообщения',
      } as error.INetworkError;
    }
  };

  apiTwo = async (processId: string) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     status: 'STARTED',
    //     dateBegin: new Date(),
    //     id: '1111',
    //     idDb: '11111',
    //     processedMessages: [],
    //     messages: [],
    //   } as types.IProcess;
    // }

    try {
      const res = await this.api.axios.get<IResponse<IProcess[]>>(`/process/${processId}/`);
      const resData = res.data;

      // if (resData.result) {
      //   return {
      //     status: 'STARTED',
      //     messageList: resData.data,
      //   } as types.IProcess;
      // }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения сообщения',
      } as error.INetworkError;
    }
  };

  apiThree = async ({ processId }: { processId: string }) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     status: 'STARTED',
    //     dateBegin: new Date(),
    //     id: '1111',
    //     idDb: '11111',
    //     processedMessages: [],
    //     messages: [],
    //   } as types.IProcess;
    // }

    try {
      const res = await this.api.axios.get<IResponse<IProcess[]>>(`/process/${processId}`);
      const resData = res.data;

      // if (resData.result) {
      //   return {
      //     status: 'STARTED',
      //     messageList: resData.data,
      //   } as types.IProcess;
      // }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения сообщения',
      } as error.INetworkError;
    }
  };

  apiFour = async (processId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SUCCESS_PROCESS',
      } as types.IProcessSuccessfulResponse;
    }

    try {
      const res = await this.api.axios.get<IResponse<void>>(`/process/${processId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'SUCCESS_PROCESS',
        } as types.IProcessSuccessfulResponse;
      }
      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка ',
      } as error.INetworkError;
    }
  };

  apiFive = async (processId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR_PROCESS',
      } as types.IProcessErrorResponse;
    }

    try {
      const res = await this.api.axios.get<IResponse<void>>(`/process/${processId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'ERROR_PROCESS',
        } as types.IProcessErrorResponse;
      }
      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка ',
      } as error.INetworkError;
    }
  };

  apiSix = async (processId: string) => {
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
      } as error.INetworkError;
    }
  };

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
}

export default Process;
