import { IDeviceLog, IDeviceLogFiles, IDeviceData, Settings, IFileParams } from '@lib/types';

import { error, deviceLog as types } from '../types';
import { response2Log, sleep } from '../utils';
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
    appVersion: string,
    appSettings: Settings,
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
      appVersion,
      appSettings,
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

  getDeviceLogContent = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Лог устройства не найден',
      } as error.IServerError;
    }

    const res = await customRequest<IDeviceData>({
      api: this.api.axios,
      method: 'GET',
      url: `/deviceLogs/${id}/content`,
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICELOG_CONTENT',
        deviceLog: res.data,
      } as types.IGetDeviceLogContentResponse;
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

  deleteDeviceLog = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICELOG',
      } as types.IRemoveDeviceLogResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/deviceLogs/${id}`,
      params,
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

  deleteDeviceLogs = async (customRequest: CustomRequest, files: IFileParams[]) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICELOGS',
      } as types.IRemoveDeviceLogsResponse;
    }

    const body = { files };

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'POST',
      url: '/deviceLogs/deleteList',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_DEVICELOGS',
      } as types.IRemoveDeviceLogsResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Журналы ошибок не удалены',
    } as error.IServerError;
  };
}

export default DeviceLog;
