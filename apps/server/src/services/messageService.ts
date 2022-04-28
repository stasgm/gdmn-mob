import path from 'path';

import { IDBMessage, IMessage, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { DataNotFoundException } from '../exceptions';

import { getNamedEntity } from './dao/utils';

import { getDb } from './dao/db';

const findOne = async (id: string) => {
  const db = getDb();
  const { messages } = db;
  const mess = await messages.find(id);

  if (!mess) return undefined;
  return makeMessage(mess);
};

const findAll = async () => {
  const db = getDb();
  const { messages } = db;

  const messageList = await messages.read();
  const pr = messageList.map(async (i) => await makeMessage(i));

  return Promise.all(pr);
};

/**
 * Возвращает все сообщения по пользователю и организации
 * @param {string} appSystem - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @param {string} userId - идентификатор пользователя
 * @return массив сообщений
 * */
const FindMany = async ({
  appSystem,
  companyId,
  consumerId,
}: {
  appSystem: string;
  companyId: string;
  consumerId: string;
}) => {
  const db = getDb();
  const { messages, companies, users, dbPath } = db;

  await db.messages.setCollectionPath(path.join(dbPath, `DB_${companyId}/${appSystem}/messages`));

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

/**
 * Добавляет одно сообщение
 * @param {NewMessage} msgObject  - заголовок сообщения
 * @param {string} producerId - тело сообщения
 * @param {string} appSystem - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @return id, идентификатор сообщения
 * */

const addOne = async ({
  msgObject,
  producerId,
  appSystem,
  companyId,
}: {
  msgObject: NewMessage;
  producerId: string;
  appSystem: string;
  companyId: string;
}): Promise<string> => {
  const db = getDb();
  const { messages, dbPath } = db;
  await db.messages.setCollectionPath(path.join(dbPath, `DB_${companyId}/${appSystem}/messages`));

  /*if (await messages.find((i) => i.id === msgObject.id)) {
    throw new Error('сообщение с таким идентификатором уже добавлено');
  }*/

  const newMessage = await makeDBNewMessage(msgObject, producerId);

  const fileInfo = {
    id: newMessage.id,
    producer: newMessage.head.producerId,
    consumer: newMessage.head.consumerId,
  };

  const messageId = await messages.insert(newMessage, fileInfo);

  return messageId;
};

/**
 * Обновляет одно сообщение
 * @param {IMessage} message - сообщение
 * @return id, идентификатор сообщения
 * */
/*const updateOne = async (message: IMessage): Promise<string> => {
  const db = getDb();
  const { messages } = db;

  const oldMessage = await messages.find((i) => i.id === message.id);

  if (!oldMessage) {
    throw new DataNotFoundException('Сообщение не найдено');
  }

  // Удаляем поля которые нельзя перезаписывать
  // eslint-disable-next-line no-param-reassign
  //delete message.head.id;

  await messages.update({ ...oldMessage, ...makeDBMessage(message) });

  return message.id!;
};

/**
 * Удаляет одно сообщениме
 * @param {string} id - идентификатор сообщения
 * @param {string} appSystem - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * */
const deleteOne = async (messageId: string): Promise<string> => {
  const db = getDb();
  const { messages, dbPath } = db;
  const oldMessage = await messages.find(messageId);
  const companyId = oldMessage.head.companyId;
  const appSystem = oldMessage.head.appSystem;

  await db.messages.setCollectionPath(path.join(dbPath, `DB_${companyId}/${appSystem}/messages`));

  /*  if (!(await messages.find(messageId))) {
    throw new DataNotFoundException('Сообщение не найдено');
  } */

  try {
    await messages.delete(messageId);
    return 'Сообщение удалено';
  } catch (err) {
    throw new DataNotFoundException(err as string);
  }

  //TODO ответ возвращать
};

// /**
//  * Удаляет одно сообщениме
//  * @param {string} companyId - идентификатор организации
//  * @param {string} uid - идентификатор сообщения
//  * */
// const deleteByUid = async ({
//   companyId,
//   uid,
//   userId,
// }: {
//   companyId: string;
//   uid: string;
//   userId: string;
// }): Promise<void> => {
//   const db = getDb();
//   const { messages } = db;

//   const messageObj = await messages.find(
//     (message) => message.head.companyId === companyId && message.head.consumerId === userId && message.id === uid,
//   );

//   if (!messageObj) {
//     throw new DataNotFoundException('Сообщение не найдено');
//   }

//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   return messages.delete(messageObj.id!);
// };

const deleteAll = async (): Promise<string> => {
  const db = getDb();
  const { messages } = db;
  messages.deleteAll();

  return 'Сообщения удалены';
  //TODO Ответ возвращать
};

export const makeMessage = async (message: IDBMessage): Promise<IMessage> => {
  const db = getDb();
  const { users, companies } = db;

  const consumer = await getNamedEntity(message.head.consumerId, users);
  const producer = await getNamedEntity(message.head.producerId, users);
  const company = await getNamedEntity(message.head.companyId, companies);

  return {
    id: message.id,
    head: {
      appSystem: message.head.appSystem,
      company,
      consumer,
      producer,
      dateTime: message.head.dateTime,
    },
    status: message.status,
    body: message.body,
  };
};

export const makeDBMessage = (message: IMessage): IDBMessage => {
  return {
    id: message.id,
    head: {
      appSystem: message.head.appSystem,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId: message.head.producer.id,
      dateTime: message.head.dateTime,
    },
    status: message.status,
    body: message.body,
  };
};

export const makeDBNewMessage = async (message: NewMessage, producerId: string): Promise<IDBMessage> => {
  return {
    id: uuidv1(),
    head: {
      appSystem: message.head.appSystem,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId: producerId,
      dateTime: new Date().toISOString(),
    },
    status: message.status,
    body: message.body,
  };
};

export { findOne, findAll, addOne, deleteOne, FindMany, deleteAll };
