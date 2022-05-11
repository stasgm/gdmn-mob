import { IDBMessage, IMessage, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { DataNotFoundException } from '../exceptions';

import { getNamedEntity } from './dao/utils';

import { getDb } from './dao/db';

/**
 * Возвращает все сообщения по пользователю и организации
 * @param {string} appSystem - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @param {string} userId - идентификатор пользователя
 * @return массив сообщений
 * */
const FindMany = async ({
  appSystemId,
  companyId,
  consumerId,
}: {
  appSystemId: string;
  companyId: string;
  consumerId: string;
}) => {
  const { messages, companies, appSystems, users } = getDb();

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const consumer = await users.find(consumerId);

  if (!consumer) {
    throw new DataNotFoundException('Получатель не найден');
  }

  const appSystem = await appSystems.find(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const params = { companyId, appSystemName: appSystem.name };

  const messageList = await messages.read(params, (item) => item.consumer === consumerId);
  const pr = messageList.map(async (i) => await makeMessage(i));

  return Promise.all(pr);
};

/**
 * Добавляет одно сообщение
 * @param {NewMessage} msgObject  - заголовок сообщения
 * @param {string} producerId - тело сообщения
 * @param {string} appSystemId - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @return id, идентификатор сообщения
 * */

const addOne = async ({
  msgObject,
  producerId,
  appSystemId,
  companyId,
}: {
  msgObject: NewMessage;
  producerId: string;
  appSystemId: string;
  companyId: string;
}): Promise<string> => {
  const { messages, companies, appSystems, users } = getDb();

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const producer = await users.find(producerId);

  if (!producer) {
    throw new DataNotFoundException('Отпарвитель не найден');
  }

  const appSystem = await appSystems.find(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const newMessage = await makeDBNewMessage(msgObject, producerId);

  const fileInfo = {
    id: newMessage.id,
    producer: newMessage.head.producerId,
    consumer: newMessage.head.consumerId,
  };

  const params = { companyId, appSystemName: appSystem.name };

  const messageId = await messages.insert(newMessage, params, fileInfo);

  return messageId;
};

const deleteOne = async ({
  messageId,
  companyId,
  appSystemId,
}: {
  messageId: string;
  companyId: string;
  appSystemId: string;
}): Promise<string> => {
  const { messages, companies, appSystems } = getDb();

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = await appSystems.find(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const params = { companyId, appSystemName: appSystem.name };

  await messages.delete(params, messageId);

  return 'Сообщение удалено';
};

const clear = async ({ companyId, appSystemId }: { companyId: string; appSystemId: string }): Promise<string> => {
  const { messages, companies, appSystems } = getDb();

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = await appSystems.find(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const params = { companyId, appSystemName: appSystem.name };

  messages.deleteAll(params);

  return 'Сообщения удалены';
};

export const makeMessage = async (message: IDBMessage): Promise<IMessage> => {
  const db = getDb();
  const { users, companies, appSystems } = db;

  const consumer = await getNamedEntity(message.head.consumerId, users);
  const producer = await getNamedEntity(message.head.producerId, users);
  const company = await getNamedEntity(message.head.companyId, companies);
  const appSystem = await getNamedEntity(message.head.appSystemId, appSystems);

  return {
    id: message.id,
    head: {
      appSystem,
      company,
      consumer,
      producer,
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
      appSystemId: message.head.appSystem.id,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId,
      dateTime: new Date().toISOString(),
    },
    status: message.status,
    body: message.body,
  };
};

export { addOne, deleteOne, FindMany, clear };
