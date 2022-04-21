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

export type AddProcess = {
  companyId: string;
  appSystem: string;
  consumerId: string;
};

export type AddProcessRequest = Omit<AddProcess, 'consumerId'>;

export interface IAddProcessResponse {
  status: 'BUSY' | 'OK';
  processId?: string;
  files?: IFiles;
}

export type UpdateProcess = {
  processedFiles: IFiles;
};

export interface IUpdateProcessResponse {
  status: 'OK' | 'CANCELLED';
}

export type CancelProcess = {
  errorMessage: string;
};

export type InterruptProcess = {
  errorMessage: string;
};
