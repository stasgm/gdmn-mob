import { IDBMessage, IMessage, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { entities } from './dao/db';
import { getNamedEntity } from './dao/utils';

const { messages, users, companies } = entities;

const findOne = async (id: string) => {
  return makeMessage(await messages.find(id));
};

const findAll = async () => {
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
const FindMany = async ({ appSystem, companyId, userId }: { appSystem: string; companyId: string; userId: string }) => {
  const messageList = (await messages.read()).filter(
    (i) => i.head.appSystem === appSystem && i.head.companyId === companyId && i.head.consumerId === userId,
  );
  const pr = messageList.map(async (i) => await makeMessage(i));

  return Promise.all(pr);
};

/**
 * Добавляет одно сообщение
 * @param {string} head - заголовок сообщения
 * @param {string} body - тело сообщения
 * @return id, идентификатор сообщения
 * */

const addOne = async ({ msgObject, producerId }: { msgObject: NewMessage; producerId: string }): Promise<string> => {
  /*if (await messages.find((i) => i.id === msgObject.id)) {
    throw new Error('сообщение с таким идентификатором уже добавлено');
  }*/

  return messages.insert(makeDBNewMessage(msgObject, producerId));
};

/**
 * Обновляет одно сообщение
 * @param {IMessage} message - сообщение
 * @return id, идентификатор сообщения
 * */
const updateOne = async (message: IMessage): Promise<string> => {
  const oldMessage = await messages.find((i) => i.id === message.id);

  if (!oldMessage) {
    throw new Error('сообщение не найдено');
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
 * */
const deleteOne = async (messageId: string): Promise<void> => {
  if (!(await messages.find(messageId))) {
    throw new Error('сообщение не найдено');
  }

  await messages.delete(messageId);
};

/**
 * Удаляет одно сообщениме
 * @param {string} companyId - идентификатор организации
 * @param {string} uid - идентификатор сообщения
 * */
const deleteByUid = async ({
  companyId,
  uid,
  userId,
}: {
  companyId: string;
  uid: string;
  userId: string;
}): Promise<void> => {
  const messageObj = await messages.find(
    (message) => message.head.companyId === companyId && message.head.consumerId === userId && message.id === uid,
  );

  if (!messageObj) {
    throw new Error('сообщение не найдено');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return messages.delete(messageObj.id!);
};

const deleteAll = async (): Promise<void> => messages.deleteAll();

export const makeMessage = async (message: IDBMessage): Promise<IMessage> => {
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
    body: message.body,
  };
};

export const makeDBNewMessage = (message: NewMessage, producerId: string): IDBMessage => {
  return {
    id: uuidv1(),
    head: {
      appSystem: message.head.appSystem,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId: producerId,
      dateTime: new Date().toISOString(),
    },
    body: message.body,
  };
};

export { findOne, findAll, addOne, deleteOne, updateOne, FindMany, deleteByUid, deleteAll };
