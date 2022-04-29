import { IAppSystem } from '@lib/types';

export interface IAppSystemQueryResponse {
  type: 'GET_APP_SYSTEM' | 'GET_APP_SYSTEMS' | 'ADD_APP_SYSTEM' | 'UPDATE_APP_SYSTEM' | 'REMOVE_APP_SYSTEM';
}

export interface IGetAppSystemResponse extends IAppSystemQueryResponse {
  type: 'GET_APP_SYSTEM';
  appSystem: IAppSystem;
}

export interface IGetAppSystemsResponse extends IAppSystemQueryResponse {
  type: 'GET_APP_SYSTEMS';
  appSystems: IAppSystem[];
}

export interface IAddAppSystemResponse extends IAppSystemQueryResponse {
  type: 'ADD_APP_SYSTEM';
  appSystem: IAppSystem;
}

export interface IUpdateAppSystemResponse extends IAppSystemQueryResponse {
  type: 'UPDATE_APP_SYSTEM';
  appSystem: IAppSystem;
}

export interface IRemoveAppSystemResponse extends IAppSystemQueryResponse {
  type: 'REMOVE_APP_SYSTEM';
}

export type QueryResponse =
  | IGetAppSystemsResponse
  | IGetAppSystemResponse
  | IAddAppSystemResponse
  | IUpdateAppSystemResponse
  | IRemoveAppSystemResponse;
