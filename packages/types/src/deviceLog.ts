import { IEntity, INamedEntity } from './common';

export interface IDeviceLog {
  id: string;
  name: string;
  date: string;
  message: string;
  isSent?: boolean;
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

export interface IDeviceLogFiles extends IEntity {
  company: INamedEntity;
  appSystem: INamedEntity;
  contact: INamedEntity;
  device: INamedEntity;
  date: string;
  size: number;
  path: string;
  alias: string;
}
