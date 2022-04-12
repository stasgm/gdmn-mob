import { ITransfer, Transfer } from '@lib/types';
import { v1 as uuid } from 'uuid';

let __transfer: Transfer = undefined;

/**
 * Возвращает текущий процесс, если он есть или undefined
 * если сервер свободен
 */
const getTransferFlag = () => __transfer;

/**
 * Устанавливаем данные текущего процесса.
 */
const setTransferFlag = (): ITransfer => {
  if (__transfer) {
    throw new Error(`There is a process running right now ${__transfer.uid}`);
  }
  return (__transfer = { uid: uuid(), uDate: new Date().toISOString() });
};

const clearTransferFlag = () => {
  if (!__transfer) {
    throw new Error('There is no process running right now');
  }
  __transfer = undefined;
};

export { getTransferFlag, setTransferFlag, clearTransferFlag };
