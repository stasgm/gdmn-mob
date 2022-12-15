import { IDeviceLog, IFileSystem } from '@lib/types';

export interface IFileQueryResponse {
  type: 'GET_FILES' | 'GET_FILE' | 'ADD_FILE' | 'UPDATE_FILE' | 'REMOVE_FILE' | 'REMOVE_FILES';
}

export interface IGetFilesResponse extends IFileQueryResponse {
  type: 'GET_FILES';
  files: IFileSystem[];
}

export interface IGetFileResponse extends IFileQueryResponse {
  type: 'GET_FILE';
  file: any;
}

export interface IAddFileResponse extends IFileQueryResponse {
  type: 'ADD_FILE';
}

export interface IUpdateFileResponse extends IFileQueryResponse {
  type: 'UPDATE_FILE';
  file: any;
}

export interface IRemoveFileResponse extends IFileQueryResponse {
  type: 'REMOVE_FILE';
}

export interface IRemoveFilesResponse extends IFileQueryResponse {
  type: 'REMOVE_FILES';
  fileIds: string[];
}
