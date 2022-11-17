import { IDeviceLog, IDeviceLogFiles, IDeviceLogParams, IResponse } from '@lib/types';

import dev from '@lib/client-config/src/dev';

import { error, deviceLog as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class DeviceLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceLog = async (companyId: string, appSystemId: string, deviceLog: IDeviceLog[]) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    try {
      const body: IDeviceLogParams = {
        companyId,
        appSystemId,
        deviceLog,
      };
      const res = await this.api.axios.post<IResponse<void>>('/deviceLogs/', body);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'ADD_DEVICELOG',
        } as types.IAddDeviceLogResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка сохранения журнала ошибок устройства',
      } as error.INetworkError;
    }
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
        message: 'Подсистема не найдена',
      } as error.INetworkError;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDeviceLogFiles>>(`/deviceLogs/${deviceLogId}`);
      const resData = res.data;

      console.log('res111', res);
      if (resData.result) {
        return {
          type: 'GET_DEVICELOG',
          deviceLog: resData?.data || [],
        } as types.IGetDeviceLogResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о журнале ошибок',
      } as error.INetworkError;
    }
  };

  getDeviceLogs = async (params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICELOGS',
        // deviceLogs: mockDeviceLogs,
      } as types.IGetDeviceLogsResponse;
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
        } as types.IGetDeviceLogsResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных об журнале ошібок',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о журнале ошибок устройства',
      } as error.INetworkError;
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
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления журнала ошибок',
      } as error.INetworkError;
    }
  };
}
export default DeviceLog;
