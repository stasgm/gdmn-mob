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
  [key: string]: unknown;
  company: INamedEntity;
  appSystem: INamedEntity;
  contact: INamedEntity;
  device: INamedEntity;
  date: string;
  size: number;
  mdate: string;
  ext: string;
  folder?: string;
}

export interface IDeviceLogOptions {
  [fieldName: string]: unknown;
  company: string;
  appSystem: string;
  contact: string;
  device: string;
  uid: string;
  date: string;
}
