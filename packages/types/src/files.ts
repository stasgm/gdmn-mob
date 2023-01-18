import { IEntity, INamedEntity } from './common';

export interface IExtraFileInfo {
  company?: INamedEntity;
  appSystem?: INamedEntity;
  consumer?: INamedEntity;
  producer?: INamedEntity;
  device?: INamedEntity;
}

export interface IFileSystem extends IEntity, IExtraFileInfo {
  date: string;
  size: number;
  fileName: string;
  path: string;
}

export interface IFileFormik extends IExtraFileInfo {
  [fieldName: string]: unknown;
  path: string;
  fileName: string;
  uid: string;
  date: string;
}

export interface IFileIds {
  ids: string[];
}
