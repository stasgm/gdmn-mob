import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

export interface IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS' | 'GET_DEVICELOG' | 'ADD_DEVICELOG' | 'REMOVE_DEVICELOG';
}

export interface IGetDeviceLogsResponse extends IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS';
  deviceLogs: IDeviceLogFiles[];
}

export interface IGetDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'GET_DEVICELOG';
  deviceLog: IDeviceLog[];
}

export interface IAddDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'ADD_DEVICELOG';
}

export interface IRemoveDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'REMOVE_DEVICELOG';
}
