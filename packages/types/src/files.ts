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
