import { INamedEntity } from './common';

export interface IDeviceLog extends INamedEntity {
  date: string;
  message: string;
}

export interface IFileDeviceLogInfo {
  producerId: string;
  deviceId: string;
}

export interface IPathParams {
  companyId: string;
  appSystemId: string;
}

export interface IDeviceLogParams extends IPathParams {
  deviceLog: IDeviceLog[];
}
