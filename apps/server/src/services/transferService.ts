import { Transfer } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { getDb } from './dao/db';

/**
 * Проверяет глобальную переменную обмена сообщений
 * */
const getTransfer = (): Transfer => {
  const db = getDb();
  const { messages } = db;

  try {
    return messages.getTransfer();
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 * Устанавливает глобальную переменную обмена сообщений с переданным uid
 * */
const setTransfer = (): Transfer => {
  const db = getDb();
  const { messages } = db;

  try {
    return messages.setTransfer();
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 *  Завершает процесс с заданным uid ( устанавливает в глобалной переменной
 *  обмена сообщений  uid = '0'
 * */
const deleteTransfer = (uid: string): string => {
  const db = getDb();
  const { messages } = db;

  try {
    messages.deleteTransfer(uid);
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
