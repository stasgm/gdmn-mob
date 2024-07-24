import { IEntity, INamedEntity } from './common';

export interface IExtraFileInfo {
  company?: INamedEntity;
  appSystem?: INamedEntity;
  consumer?: INamedEntity;
  producer?: INamedEntity;
  device?: INamedEntity;
  uid?: string;
  folder?: string;
}

export interface ISystemFile extends IEntity, IExtraFileInfo {
  [key: string]: unknown;
  date: string;
  size: number;
  path: string;
  mdate: string;
}

export interface IPathParams {
  companyId: string;
  appSystemId: string;
  folder?: string;
}

export interface IFileQueryParams {
  companyId?: string;
  appSystemId?: string;
  folder?: string;
}

export interface IFileParams extends IFileQueryParams {
  id: string;
}

export interface ISystemFileParams {
  companyId: string;
  appSystemId?: string;
  id?: string;
  folder?: string;
}

export interface IDeleteFilesRequest {
  files: IFileParams[];
}

export interface IMoveFilesRequest {
  files: IFileParams[];
  toFolder?: string;
}

export interface IFileActionResult {
  file: string;
  success: boolean;
  error?: string;
}
