import environment from './environment';

export interface IConnectionServer {
  host: string;
  port: number;
}

export interface IConnectionOptions {
  server?: IConnectionServer;
  username: string;
  password: string;
  path: string;
  readTransaction?: boolean;
}

export const dbOptions: IConnectionOptions = {
  server: { host: environment.FIREBIRD_HOST, port: environment.FIREBIRD_PORT },
  path: environment.FIREBIRD_DATABASE,
  username: environment.FIREBIRD_USER,
  password: environment.FIREBIRD_PASSWORD,
};
