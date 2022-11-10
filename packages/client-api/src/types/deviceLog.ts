import { IDeviceLog } from '@lib/types';

export interface IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS' | 'ADD_DEVICELOG';
}

export interface IGetDeviceLogsResponse extends IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS';
  deviceLogs: IDeviceLog[];
}

export interface IAddDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'ADD_DEVICELOG';
}
