import { ICheckTransafer } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { getDb } from './dao/db';

/**
 * Удаляет файл-маркер окончания обмена сообщений
 * */
const deleteEndTransfer = async (): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  try {
    await messages.deleteTransfer();
    return 'Файл endTransafer.txt удален';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 * Добавляет файл-маркер окончания обмена сообщений
 * */
const insertEndTransfer = async (): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  try {
    await messages.insertTransfer();
    return 'Файл endTransafer.txt добавлен';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }
};

/**
 * Проверяет наличие файла-маркера окончания обмена сообщений
 * */
const checkEndTransfer = async (): Promise<ICheckTransafer> => {
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
};

export { deleteEndTransfer, insertEndTransfer, checkEndTransfer };
