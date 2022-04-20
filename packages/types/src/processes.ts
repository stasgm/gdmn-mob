import { IMessage } from './messages';

export type ProcessType = 'STARTED' | 'READY_TO_COMMIT' | 'CANCEL' | 'CLEANUP' | 'FAILED';

export interface IProcess {
  id: string;
  companyId: string;
  appSystem: string;
  dateBegin: Date;
  fileNames: string[];
  processedFileNames: string[];
  status: ProcessType;
  processedFiles?: IFiles;
  dateReadyToCommit?: Date;
}

export type IDBProcess = IProcess;

export interface IFiles {
  [name: string]: IMessage;
}
export interface IGetProcessResponse {
  status: 'BUSY' | 'IDLE' | 'OK';
  processId?: string;
  files?: IFiles;
}

export interface IUpdateProcessResponse {
  status: 'OK' | 'CANCELLED';
}
