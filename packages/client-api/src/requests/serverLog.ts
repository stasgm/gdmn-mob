import { IServerLogFile, IServerLogResponse } from '@lib/types';

import { error, serverLog as types } from '../types';
import { response2Log, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class ServerLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getServerLog = async (customRequest: CustomRequest, serverLogId: string) => {
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
      url: `/serverLogs/${serverLogId}`,
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

  getServerLogs = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_SERVERLOGS',
        // files: mockFiles,
      } as types.IGetServerLogsResponse;
    }

    const res = await customRequest<IServerLogFile[]>({
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
