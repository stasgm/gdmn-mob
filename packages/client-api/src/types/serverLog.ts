export interface IServerLogQueryResponse {
  type: 'GET_SERVERLOGS' | 'GET_SERVERLOG';
}

export interface IGetServerLogsResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOGS';
  serverLogs: IServerLog[];
}

export interface IGetServerLogResponse extends IServerLogQueryResponse {
  type: 'GET_SERVERLOG';
  serverLog: any;
}

export interface IServerLog {
  name: string;
}
