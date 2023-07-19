import { IEntity, INamedEntity } from './common';

export interface IExtraFileInfo {
  company?: INamedEntity;
  appSystem?: INamedEntity;
  consumer?: INamedEntity;
  producer?: INamedEntity;
  device?: INamedEntity;
}

export interface IFileSystem extends IEntity, IExtraFileInfo {
  [key: string]: unknown;
  date: string;
  size: number;
  fileName: string;
  path: string;
  mdate: string;
}

export interface IFileSearchOptions {
  [fieldName: string]: unknown;
  path: string;
  fileName: string;
  uid: string;
  date: string;
  company: string;
  appSystem: string;
  consumer: string;
  producer: string;
  device: string;
}

export interface IFileIds {
  ids: string[];
  folderName?: string;
}
