import { IDeviceData, IDeviceLogFiles } from '@lib/types';

export interface IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS' | 'GET_DEVICELOG' | 'ADD_DEVICELOG' | 'REMOVE_DEVICELOG' | 'REMOVE_DEVICELOGS';
}

export interface IGetDeviceLogFilesResponse extends IDeviceLogQueryResponse {
  type: 'GET_DEVICELOGS';
  deviceLogs: IDeviceLogFiles[];
}

export interface IGetDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'GET_DEVICELOG';
  deviceLog: IDeviceData;
}

export interface IAddDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'ADD_DEVICELOG';
}

export interface IRemoveDeviceLogResponse extends IDeviceLogQueryResponse {
  type: 'REMOVE_DEVICELOG';
}

export interface IRemoveDeviceLogsResponse extends IDeviceLogQueryResponse {
  type: 'REMOVE_DEVICELOGS';
  deviceLogIds: string[];
}
