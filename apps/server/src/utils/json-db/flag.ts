import { Transfer } from '@lib/types';

let __transfer: Transfer = undefined;

export const getTransferFlag = () => {
  return __transfer;
};

export const setTransferFlag = (transfer: Transfer) => {
  __transfer = transfer;
};
