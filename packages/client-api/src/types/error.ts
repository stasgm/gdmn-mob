export interface IServerError {
  type: 'ERROR' | 'NO_CONNECTION' | 'INVALID_DATA' | 'SERVER_TIMEOUT';
  message: string;
}
