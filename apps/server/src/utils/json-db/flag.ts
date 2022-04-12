// import { ITransfer, Transfer } from '@lib/types';
// import { v1 as uuid } from 'uuid';

// let __transfer: Transfer = undefined;

// /**
//  * Возвращает текущий процесс, если он есть или undefined
//  * если сервер свободен
//  */
// export const getTransferFlag = () => __transfer;

// /**
//  * Устанавливаем данные текущего процесса.
//  */
// export const setTransferFlag = (): ITransfer => {
//   if (__transfer) {
//     throw new Error(`There is a process running right now ${__transfer.uid}`);
//   }
//   return (__transfer = { uid: uuid(), uDate: new Date().toISOString() });
// };

// export const clearTransferFlag = () => {
//   if (!__transfer) {
//     throw new Error('There is no process running right now');
//   }
//   __transfer = undefined;
// };
