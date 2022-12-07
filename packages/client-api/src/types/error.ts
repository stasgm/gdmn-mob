export interface IServerError {
  type: 'ERROR' | 'CONNECT_ERROR';
  message: string;
}
