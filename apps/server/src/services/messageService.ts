import { IDBMessage, IFileMessageInfo, IMessage, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { DataNotFoundException } from '../exceptions';

import { getNamedEntity } from './dao/utils';

import { getDb } from './dao/db';

/**
 * Добавляет одно сообщение
 * @param {NewMessage} msgObject  - заголовок сообщения
 * @param {string} producerId - тело сообщения
 * @param {string} appSystemId - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @return id, идентификатор сообщения
 * */
/**
 * Создает сообщение
 * @param param0 Данные сообщения
 * @returns ИД созданного сообщения
 */
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

  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (!users.findById(producerId)) {
    throw new DataNotFoundException('Отправитель не найден');
  }

  const appSystem = appSystems.findById(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const newMessage = await makeDBNewMessage(msgObject, producerId);

  const fileInfo: IFileMessageInfo = {
    id: newMessage.id,
    producerId,
    consumerId: newMessage.head.consumerId,
  };

  return await messages.insert(newMessage, { companyId, appSystemName: appSystem.name }, fileInfo);
};

/**
 * Возвращает все сообщения по пользователю и организации
 * @param param0 appSystemId - ИД подсистемы
 * companyId - ИД организации
 * consumerId - ИД получателя
 * @return массив сообщений
 * */
const FindMany = async ({
  appSystemName,
  companyId,
  consumerId,
}: {
  appSystemName: string;
  companyId: string;
  consumerId: string;
}) => {
  const { messages, users } = getDb();

  if (!users.findById(consumerId)) {
    throw new DataNotFoundException('Получатель не найден');
  }

  const messageList = await messages.read({ companyId, appSystemName }, (item) => item.consumerId === consumerId);
  const pr = messageList.map(async (i) => await makeMessage(i));

  return Promise.all(pr);
};

const deleteOne = async ({
  messageId,
  companyId,
  appSystemName,
}: {
  messageId: string;
  companyId: string;
  appSystemName: string;
}): Promise<void> => await getDb().messages.delete({ companyId, appSystemName }, messageId);

const clear = async ({ companyId, appSystemName }: { companyId: string; appSystemName: string }): Promise<void[]> =>
  await getDb().messages.deleteAll({ companyId, appSystemName });

export const makeMessage = async (message: IDBMessage): Promise<IMessage> => {
  const { users, companies, appSystems } = getDb();

  return {
    id: message.id,
    head: {
      appSystem: getNamedEntity(message.head.appSystemId, appSystems),
      company: getNamedEntity(message.head.companyId, companies),
      consumer: getNamedEntity(message.head.consumerId, users),
      producer: getNamedEntity(message.head.producerId, users),
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
