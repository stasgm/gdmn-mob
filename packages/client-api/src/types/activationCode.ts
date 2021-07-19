import { IActivationCode } from '@lib/types';

export interface IActivationCodeQueryResponse {
  type: 'GET_ACTIVATION_CODES';
}

export interface IGetActivationCodesResponse extends IActivationCodeQueryResponse {
  type: 'GET_ACTIVATION_CODES';
  activationCodes: IActivationCode[];
}

export type QueryResponse = IGetActivationCodesResponse;
