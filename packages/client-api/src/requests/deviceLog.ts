import { IDeviceLogEntry, IDeviceLogFile, IDeviceData, Settings, IFileParams, IFileActionResult } from '@lib/types';

import { error, deviceLog as types, BaseApi, BaseRequest } from '../types';
import { response2Log, sleep } from '../utils';
import { CustomRequest } from '../robustRequest';

class DeviceLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceLog = async (
    customRequest: CustomRequest,
    companyId: string,
    appSystemId: string,
    deviceLog: IDeviceLogEntry[],
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

  getDeviceLog = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>) => {
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
      url: `/deviceLogs/${id}`,
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICELOG',
        deviceLogData: res.data,
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
        deviceLogFiles: [],
      } as types.IGetDeviceLogFilesResponse;
    }

    const res = await customRequest<IDeviceLogFile[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/deviceLogs',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_DEVICELOGS',
        deviceLogFiles: res.data || [],
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

    const res = await customRequest<IFileActionResult[]>({
      api: this.api.axios,
      method: 'POST',
      url: '/deviceLogs/actions/deleteList',
      data: body,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_DEVICELOGS',
        deletedFiles: res?.data || [],
      } as types.IRemoveDeviceLogsResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Журналы ошибок не удалены',
    } as error.IServerError;
  };
}

export default DeviceLog;
