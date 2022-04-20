import { IMessage } from '@lib/types';

export type ProcessType = 'STARTED' | 'READY_TO_COMMIT' | 'CANCEL' | 'CLEANUP' | 'FAILED';

export interface IProcess {
  id: string;
  idDb: string;
  dateBegin: Date;
  messages: any[];
  processedMessages: any[];
  status: ProcessType;
  dateReadyToCommit?: Date;
}

export interface IProcessSuccessfulResponse {
  type: 'SUCCESS_PROCESS';
}

export interface IProcessErrorResponse {
  type: 'ERROR_PROCESS';
}

export interface IRemoveProcessResponse {
  type: 'REMOVE_PROCESS';
}
