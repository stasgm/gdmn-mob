import { IAppSystem } from '@lib/types';

export interface IAppSystemQueryResponse {
  type: 'GET_APP_SYSTEMS';
}

export interface IGetAppSystemsResponse extends IAppSystemQueryResponse {
  type: 'GET_APP_SYSTEMS';
  appSystems: IAppSystem[];
}

export type QueryResponse = IGetAppSystemsResponse;
