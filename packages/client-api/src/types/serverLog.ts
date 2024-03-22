import { ServerLogFile } from '@lib/types';

export interface IServerLogQueryResponse {
  type: 'GET_SERVERLOGS' | 'GET_SERVERLOG';
}

export interface IGetServerLogsResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOGS';
  serverLogs: ServerLogFile[];
}

export interface IGetServerLogResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOG';
  serverLog: string;
}
