import { IDeviceLog, IDeviceLogFiles, IDeviceLogParams, IResponse } from '@lib/types';

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

  getDeviceLogs = async (params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_DEVICELOGS',
        // appSystems: mockAppSystems,
      } as types.IGetDeviceLogsResponse;
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IDeviceLogFiles[]>>(`/deviceLogs${paramText}`);
      console.log('res,', res);
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
}
export default DeviceLog;
