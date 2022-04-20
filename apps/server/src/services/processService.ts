import { DataNotFoundException } from '../exceptions';

import { getDb } from './dao/db';

const apiOne = async ({ idDb, consumerId }: { idDb: string; companyId: string; consumerId: string }) => {
  const db = getDb();
  const { messages, companies, users } = db;

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const consumer = await users.find(consumerId);

  if (!consumer) {
    throw new DataNotFoundException('Получатель не найден');
  }

  const messageList = await messages.read((item) => item.consumer === consumerId);
  const pr = messageList.map(async (i) => await makeMessage(i));

  return Promise.all(pr);
};

const apiTwo = async ({ msgObject, processedId }: { msgObject: any[]; processedId: string }) => {
  const db = getDb();
  const { process } = db;
  const pr = await process.find(processedId);
};

const apiThree = async (processedId: string) => {
  const db = getDb();
  const { process } = db;
  const pr = await process.find(processedId);
};

const apiFour = async (processedId: string) => {
  const db = getDb();
  const { process } = db;
  const pr = await process.find(processedId);
};

const apiFive = async (processedId: string) => {
  const db = getDb();
  const { process } = db;
  const pr = await process.find(processedId);
};
/**
 * Удаляет один процесс
 * @param {string} id - идентификатор сообщения
 * */
const apiSix = async (processId: string): Promise<string> => {
  const db = getDb();
  const { process } = db;

  /*  if (!(await messages.find(messageId))) {
    throw new DataNotFoundException('Сообщение не найдено');
  } */

  try {
    await process.delete(processId);
    return 'Процесс удален';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }

  //TODO ответ возвращать
};

export { apiOne, apiTwo, apiThree, apiFour, apiFive, apiSix };
