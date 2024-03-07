import { IEntity, INamedEntity } from './common';
import { IFileParams, IPathParams } from './files';
import { Settings } from './settings';

export interface IDeviceData {
  appVersion: string;
  appSettings: Settings;
  logs: IDeviceLog[];
}

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

export interface IDeviceLogParams extends IPathParams {
  deviceLog: IDeviceLog[];
  appVersion?: string;
  appSettings?: Settings;
}

export interface INewDeviceLog {
  appVersion: string;
  appSettings: Settings;
  deviceLog: IDeviceLog[];
  producerId: string;
  appSystemId: string;
  companyId: string;
  deviceId: string;
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

export interface IDeleteDeviceLogsRequest {
  files: IFileParams[];
}
