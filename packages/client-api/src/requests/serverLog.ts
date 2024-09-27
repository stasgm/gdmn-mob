import { ServerLogFile } from '@lib/types';

import { error, serverLog as types, BaseApi, BaseRequest } from '../types';
import { response2Log, sleep } from '../utils';
import { CustomRequest } from '../robustRequest';

class ServerLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getServerLog = async (customRequest: CustomRequest, id: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Лог не найден',
      } as error.IServerError;
    }

    const res = await customRequest<any>({
      api: this.api.axios,
      method: 'GET',
      url: `/serverLogs/${id}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_SERVERLOG',
        serverLog: res?.data,
      } as types.IGetServerLogResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные файла не получены',
    } as error.IServerError;
  };

  getServerInfo = async (customRequest: CustomRequest) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Информация по серверу не найдена',
      } as error.IServerError;
    }

    const res = await customRequest<any>({
      api: this.api.axios,
      method: 'GET',
      url: '/serverLogs/info',
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_SERVERINFO',
        serverInfo: res?.data,
      } as types.IGetServerInfoResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Информация по серверу не получена',
    } as error.IServerError;
  };

  getServerLogs = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_SERVERLOGS',
        // files: mockFiles,
      } as types.IGetServerLogsResponse;
    }

    const res = await customRequest<ServerLogFile[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/serverLogs',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_SERVERLOGS',
        serverLogs: res?.data || [],
      } as types.IGetServerLogsResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о файле не получены',
    } as error.IServerError;
  };
}

export default ServerLog;
