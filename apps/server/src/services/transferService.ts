import { Transfer } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { getDb } from './dao/db';

/**
 * Проверяет глобальную переменную обмена сообщений
 * */
const getTransfer = async (): Promise<Transfer> => {
  const db = getDb();
  const { messages } = db;

  try {
    return await messages.getTransfer();
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 * Устанавливает глобальную переменную обмена сообщений с переданным uid
 * */
const setTransfer = async (): Promise<Transfer> => {
  const db = getDb();
  const { messages } = db;

  try {
    return await messages.setTransfer();
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 *  Завершает процесс с заданным uid ( устанавливает в глобалной переменной
 *  обмена сообщений  uid = '0'
 * */
const deleteTransfer = async (uid: string): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  try {
    await messages.deleteTransfer(uid);
    return `Процесс ${uid} завершен`;
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 * Удаляет файл-маркер окончания обмена сообщений
 * */
/* const deleteEndTransfer = async (): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  try {
    await messages.deleteTransfer();
    return 'Файл endTransafer.txt удален';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
}; */

/**
 * Добавляет файл-маркер окончания обмена сообщений
 * */
/* const insertEndTransfer = async (): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  try {
    await messages.insertTransfer();
    return 'Файл endTransafer.txt добавлен';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
}; */

/**
 * Проверяет наличие файла-маркера окончания обмена сообщений
 * */
/* const checkEndTransfer = async (): Promise<ICheckTransafer> => {
  const db = getDb();
  const { messages } = db;

  try {
    const check = await messages.checkTransfer();
    return {
      state: check,
    };
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
}; */

export { deleteTransfer, setTransfer, getTransfer };
