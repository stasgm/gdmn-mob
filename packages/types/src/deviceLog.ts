import { INamedEntity } from './common';
import { IDeleteFilesRequest, IPathParams, ISystemFile } from './files';
import { Settings } from './settings';

export interface IDeviceData {
  appVersion: string;
  appSettings: Settings;
  deviceLog: IDeviceLogEntry[];
}

export interface IDeviceLogEntry {
  id: string;
  name: string;
  date: string;
  message: string;
  isSent?: boolean;
}

export interface IDeviceLogParams extends IPathParams {
  producerId: string;
  deviceId: string;
}

export type IAddDeviceLogParams = IDeviceData & IDeviceLogParams;

export interface IDeviceLogFile extends ISystemFile {
  company: INamedEntity;
  appSystem: INamedEntity;
  producer: INamedEntity;
  device: INamedEntity;
}

export type DeleteDeviceLogsRequest = IDeleteFilesRequest;
