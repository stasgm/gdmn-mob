import { StatusType } from './common';
import { IMessage, NewMessage } from './messages';

export type ProcessType = 'STARTED' | 'READY_TO_COMMIT' | 'CANCEL' | 'CLEANUP' | 'FAILED';

export interface IProcess {
  id: string;
  companyId: string;
  appSystemId: string;
  dateBegin: Date;
  files: string[];
  status: ProcessType;
  processedFiles?: IProcessedFiles;
  dateReadyToCommit?: Date;
}

export type IDBProcess = IProcess;

export interface IFiles {
  [fileName: string]: IMessage;
}

export interface IProcessedFiles {
  [fileName: string]: { status: StatusType; replyTo?: string };
}

export type AddProcess = {
  companyId: string;
  appSystemId: string;
  consumerId: string;
  producerIds?: string[];
  maxFiles?: number;
  maxDataVolume?: number;
};

export type AddProcessRequest = Omit<AddProcess, 'consumerId'>;

export type PrepareProcess = {
  processedFiles: NewMessage[];
};

export interface IAddProcessResponse {
  status: 'BUSY' | 'OK';
  processId?: string;
  files?: IFiles;
}

export type UpdateProcess = {
  files: string[];
};

export interface IStatusResponse {
  status: 'OK' | 'CANCELLED';
}

export type CancelProcess = {
  errorMessage: string;
};

export type InterruptProcess = {
  errorMessage: string;
};
