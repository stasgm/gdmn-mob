import { IDBMessage, IFileMessageInfo, IMessage, NewMessage } from '@lib/types';

import { DataNotFoundException, InnerErrorException } from '../exceptions';
import { generateId } from '../utils/helpers';

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
  deviceId,
}: {
  msgObject: NewMessage;
  producerId: string;
  appSystemId: string;
  companyId: string;
  deviceId: string;
}): Promise<string> => {
  const { messages, companies, appSystems, users, devices } = getDb();

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

  /* if (!devices.findById(deviceId)) {
    throw new DataNotFoundException('Устройство не найдено');
  }*/

  const newMessage = await makeDBNewMessage(msgObject, producerId, deviceId);

  const fileInfo: IFileMessageInfo = {
    id: newMessage.id,
    producerId,
    consumerId: newMessage.head.consumerId,
    deviceId,
  };

  return await messages.insert(newMessage, { companyId, appSystemName: appSystem.name }, fileInfo);
};

/**
 * Возвращает все сообщения по пользователю и организации
 * @param param0 appSystemId - ИД подсистемы
 * companyId - ИД организации
 * consumerId - ИД получателя
 * deviceId - ИД устройства
 * @return массив сообщений
 * */
const FindMany = async ({
  appSystemName,
  companyId,
  consumerId,
  deviceId,
}: {
  appSystemName: string;
  companyId: string;
  consumerId: string;
  deviceId: string;
}) => {
  const { messages, users, devices } = getDb();

  if (!users.findById(consumerId)) {
    throw new DataNotFoundException('Получатель не найден');
  }

  /*if (!devices.findById(deviceId)) {
    throw new DataNotFoundException('Устройство не найдено');
  }*/

  try {
    const messageList = await messages.readByConsumerId({ companyId, appSystemName }, consumerId, deviceId);
    const pr = messageList.map(async (i) => await makeMessage(i));
    return Promise.all(pr);
  } catch (err) {
    throw new InnerErrorException(`Поиск сообщений завершился с ошибкой ${err}`);
  }
};

const deleteOne = async ({
  messageId,
  companyId,
  appSystemName,
}: {
  messageId: string;
  companyId: string;
  appSystemName: string;
}): Promise<void> => {
  try {
    await getDb().messages.deleteById({ companyId, appSystemName }, messageId);
  } catch (err) {
    throw new DataNotFoundException('Сообщение не найдено');
  }
};

const clear = async ({ companyId, appSystemName }: { companyId: string; appSystemName: string }): Promise<void> => {
  try {
    await getDb().messages.deleteAll({ companyId, appSystemName });
  } catch (err) {
    throw new InnerErrorException(`Удаление всех сообщений завершилось с ошибкой ${err}`);
  }
};

export const makeMessage = async (message: IDBMessage): Promise<IMessage> => {
  const { users, companies, appSystems } = getDb();

  return {
    id: message.id,
    head: {
      appSystem: appSystems.getNamedItem(message.head.appSystemId),
      company: companies.getNamedItem(message.head.companyId),
      consumer: users.getNamedItem(message.head.consumerId),
      producer: users.getNamedItem(message.head.producerId),
      dateTime: message.head.dateTime,
      order: message.head.order,
      deviceId: message.head.deviceId,
    },
    status: message.status,
    body: message.body,
  };
};

export const makeDBNewMessage = async (
  message: NewMessage,
  producerId: string,
  deviceId: string,
): Promise<IDBMessage> => {
  return {
    id: generateId(),
    head: {
      appSystemId: message.head.appSystem.id,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId,
      deviceId,
      dateTime: new Date().toISOString(),
      order: message.head.order,
    },
    status: message.status,
    body: message.body,
  };
};

export { addOne, deleteOne, FindMany, clear };
