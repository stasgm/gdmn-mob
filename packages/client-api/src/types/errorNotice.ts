import { IErrorNotice } from '@lib/store';

export interface IErrorNoticeQueryResponse {
  type: 'GET_NOTICES' | 'ADD_NOTICE';
}

export interface IGetErrorNoticesResponse extends IErrorNoticeQueryResponse {
  type: 'GET_NOTICES';
  users: IErrorNotice[];
}

export interface IAddErrorNoticeResponse extends IErrorNoticeQueryResponse {
  type: 'ADD_NOTICE';
}
