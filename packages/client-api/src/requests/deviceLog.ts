import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { error, deviceLog as types } from '../types';
import { getParams, response2Log, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class DeviceLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceLog = async (
    customRequest: CustomRequest,
    companyId: string,
    appSystemId: string,
    deviceLog: IDeviceLog[],
  ) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    const body = {
      companyId,
      appSystemId,
      deviceLog,
    };

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'POST',
      url: '/deviceLogs',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Журнал ошибок устройства не отправлен',
    } as error.IServerError;
  };

  getDeviceLog = async (customRequest: CustomRequest, deviceLogId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Журнал ошибок не найден',
      } as error.IServerError;
    }

    const res = await customRequest<IDeviceLog[]>({
      api: this.api.axios,
      method: 'GET',
      url: `/deviceLogs/${deviceLogId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICELOG',
        deviceLog: res.data,
      } as types.IGetDeviceLogResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Журнал ошибок не получен',
    } as error.IServerError;
  };

  getDeviceLogFiles = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICELOGS',
        deviceLogs: [],
      } as types.IGetDeviceLogFilesResponse;
    }

    const res = await customRequest<IDeviceLogFiles[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/deviceLogs',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICELOGS',
        deviceLogs: res.data || [],
      } as types.IGetDeviceLogFilesResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Журналы ошибок не получены',
    } as error.IServerError;
  };

  removeDeviceLog = async (customRequest: CustomRequest, deviceLogId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICELOG',
      } as types.IRemoveDeviceLogResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/deviceLogs/${deviceLogId}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_DEVICELOG',
      } as types.IRemoveDeviceLogResponse;
    }

    return {
      type: 'ERROR',
      message: response2Log(res) || 'Журнал ошибок не удален',
    } as error.IServerError;
  };
}
export default DeviceLog;
