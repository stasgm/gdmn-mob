import { IEntity, INamedEntity } from './common';

export interface IExtraFileInfo {
  company?: INamedEntity;
  appSystem?: INamedEntity;
  consumer?: INamedEntity;
  producer?: INamedEntity;
  device?: INamedEntity;
  folderName?: string;
}

export interface IFileSystem extends IEntity, IExtraFileInfo {
  [key: string]: unknown;
  date: string;
  size: number;
  path: string;
  mdate: string;
  ext: string;
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

export interface IFileQueryObject {
  companyId?: string;
  appSystemId?: string;
  folder?: string;
  ext?: string;
}

export interface IFileObject extends IFileQueryObject {
  id: string;
}
export interface IFileIds {
  ids: IFileObject[];
  toFolder?: string;
}
