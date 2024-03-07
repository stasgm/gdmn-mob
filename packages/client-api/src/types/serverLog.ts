import { ISystemFile, IServerLogResponse } from '@lib/types';

export interface IServerLogQueryResponse {
  type: 'GET_SERVERLOGS' | 'GET_SERVERLOG';
}

export interface IGetServerLogsResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOGS';
  serverLogs: ISystemFile[];
}

export interface IGetServerLogResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOG';
  serverLog: IServerLogResponse;
}
