import { ServerInfo, ServerLogFile } from '@lib/types';

export interface IServerLogQueryResponse {
  type: 'GET_SERVERLOGS' | 'GET_SERVERLOG' | 'GET_SERVERINFO';
}

export interface IGetServerLogsResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOGS';
  serverLogs: ServerLogFile[];
}

export interface IGetServerLogResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOG';
  serverLog: string;
}

export interface IGetServerInfoResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERINFO';
  serverInfo: ServerInfo;
}
