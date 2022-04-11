import { Transfer } from '@lib/types';

export interface ITransferQueryResponse {
  type: 'SET_TRANSFER' | 'GET_TRANSFER' | 'REMOVE_TRANSFER';
}

export interface IGetTransferResponse extends ITransferQueryResponse {
  type: 'GET_TRANSFER';
  status: Transfer;
}

export interface ISetTransferResponse extends ITransferQueryResponse {
  type: 'SET_TRANSFER';
  status: Transfer;
}

export interface IRemoveTransferResponse extends ITransferQueryResponse {
  type: 'REMOVE_TRANSFER';
}

export type TransferQueryResponse = IGetTransferResponse | ISetTransferResponse | IRemoveTransferResponse;
