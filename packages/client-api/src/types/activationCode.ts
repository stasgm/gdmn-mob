import { IActivationCode } from '@lib/types';

export interface IActivationCodeQueryResponse {
  type: 'ADD_ACTIVATION_CODE' | 'GET_ACTIVATION_CODE' | 'GET_ACTIVATION_CODES';
}

export interface IAddActivationCodeResponse extends IActivationCodeQueryResponse {
  type: 'ADD_ACTIVATION_CODE';
  activationCode: IActivationCode;
}

export interface IGetActivationCodesResponse extends IActivationCodeQueryResponse {
  type: 'GET_ACTIVATION_CODES';
  activationCodes: IActivationCode[];
}

export interface IGetActivationCodeResponse extends IActivationCodeQueryResponse {
  type: 'GET_ACTIVATION_CODE';
  activationCode: IActivationCode;
}

export type QueryResponse = IAddActivationCodeResponse | IGetActivationCodesResponse | IGetActivationCodeResponse;
