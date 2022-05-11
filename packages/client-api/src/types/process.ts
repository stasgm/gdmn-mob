import { IProcess } from '@lib/types';

export interface IProcessQueryResponse {
  type: 'GET_PROCESS' | 'GET_PROCESSES' | 'REMOVE_PROCESS';
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

export interface IGetProcessesResponse extends IProcessQueryResponse {
  type: 'GET_PROCESSES';
  processes: IProcess[];
}
