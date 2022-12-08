import { IDeviceLog, IDeviceLogFiles, IResponse } from '@lib/types';

import { error, deviceLog as types } from '../types';
import { getParams, sleep } from '../utils';
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

    if (res?.result) {
      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'журнал ошибок устройства не отправлен',
    } as error.IServerError;
  };

  getDeviceLog = async (deviceLogId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      // const deviceLog = mockDeviceLog.find((item) => item.id === deviceLogId);

      // if (deviceLog) {
      //   return {
      //     type: 'GET_DEVICELOG',
      //     deviceLog,
      //   } as types.IGetDeviceLogResponse;
      // }

      return {
        type: 'ERROR',
        message: 'Журнал ошибок не найден',
      } as error.IServerError;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDeviceLogFiles>>(`/deviceLogs/${deviceLogId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_DEVICELOG',
          deviceLog: resData?.data || [],
        } as types.IGetDeviceLogResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.IServerError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о журнале ошибок',
      } as error.IServerError;
    }
  };

  getDeviceLogFiles = async (params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICELOGS',
        // deviceLogs: mockDeviceLogs,
      } as types.IGetDeviceLogFilesResponse;
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDeviceLogFiles[]>>(`/deviceLogs${paramText}`);

      ///${this.api.config.version}
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_DEVICELOGS',
          deviceLogs: resData?.data || [],
        } as types.IGetDeviceLogFilesResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных об журнале ошібок',
      } as error.IServerError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о журнале ошибок устройства',
      } as error.IServerError;
    }
  };

  removeDeviceLog = async (deviceLogId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_DEVICELOG',
      } as types.IRemoveDeviceLogResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/deviceLogs/${deviceLogId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_DEVICELOG',
        } as types.IRemoveDeviceLogResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.IServerError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления журнала ошибок',
      } as error.IServerError;
    }
  };
}
export default DeviceLog;