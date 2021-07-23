import { IActivationCode } from '@lib/types';

export interface IActivationCodeQueryResponse {
  type: 'GET_CODES' | 'CREATE_CODE';
}

export interface IGetCodesResponse extends IActivationCodeQueryResponse {
  type: 'GET_CODES';
  codes: IActivationCode[];
}

export interface ICreateCodeResponse extends IActivationCodeQueryResponse {
  type: 'CREATE_CODE';
  code: IActivationCode;
}

export type QueryResponse = IGetCodesResponse | ICreateCodeResponse;
