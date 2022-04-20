import { IDBMessage, IGetProcessResponse, IMessage, IProcess, IUpdateProcessResponse, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { DataNotFoundException } from '../exceptions';

import log from '../utils/logger';

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
const FindMany = async ({ companyId, consumerId }: { appSystem: string; companyId: string; consumerId: string }) => {
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

/**
 * Добавляет одно сообщение
 * @param {string} head - заголовок сообщения
 * @param {string} body - тело сообщения
 * @return id, идентификатор сообщения
 * */

const addOne = async ({ msgObject, producerId }: { msgObject: NewMessage; producerId: string }): Promise<string> => {
  const db = getDb();
  const { messages } = db;

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
 * */
const deleteOne = async (messageId: string): Promise<string> => {
  const db = getDb();
  const { messages } = db;

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



export const updateProcess = async (processId: string, messages: IMessage[]): Promise<IUpdateProcessResponse> => {
  const db = getDb();
  const processes = db.processes;
  const process = await processes.find(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не STARTED, то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    return {
      status: 'CANCELLED',
    };
  }
  try {
    //Если процесс есть в списке в состоянии STARTED, то:
    // 1. Ему присваивается состояние READY_TO_COMMIT.
    // 2. Полученный список ИД обработанных сообщений со статусами их обработки фиксируется в объекте процесса.
    await processes.update({
      ...process,
      status: 'READY_TO_COMMIT',
      messages: [],
      processedMessages: messages, //а если только статусы?
    });

    //TODO
    //3. Формируются файлы и записываются синхронно в папку PREPARED.
    //4. Для сообщений, при обработке которых возникли ошибки, делаются записи в логе системы.
  } catch (err) {
    log.error(`Robust-protocol.updateProcess: процесс ${processId} не удалось обновить`);

    return {
      status: 'CANCELLED',
    };
  }

  return {
    status: 'OK',
  };
};

export const deleteProcess = async (processId: string): Promise<IUpdateProcessResponse> => {
  const db = getDb();
  const processes = db.processes;
  const process = await processes.find(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не STARTED,
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.deleteProcess: процесс ${processId} не найден`);
    }
    return {
      status: 'CANCELLED',
    };
  }

  try {
    //1. Переводим процесс в состояние CLEANUP.
    await processes.update({
      ...process,
      status: 'CLEANUP',
    });

    //TODO
    //2. Полученные файлы переносятся из папки PREPARED в MESSAGES.
    //3. Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
    //4. Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
    //5. Файлы, при обработке которых возник dead lock, мы не трогаем.
    //   Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.

    // По успешному переносу процесс удаляется из списка процессов.
    await processes.delete(processId);
  } catch (err) {
    //Если файлы не удается переместить -- об этом делается запись в логе сервера сообщений.
    //Процесс остается в списке. Его статус меняется на FAILED.
    //Такая ситуация требует вмешательства системного администратора.

    log.error(`Robust-protocol.deleteProcess: процесс ${processId} не удалось удалить`);

    await processes.update({
      ...process,
      status: 'FAILED',
    });
  }

  return {
    status: 'OK',
  };
};

export const cancelProcess = async (processId: string): Promise<IUpdateProcessResponse> => {
  const db = getDb();
  const processes = db.processes;
  const process = await processes.find(processId);

  if (!process) {
    log.error(`Robust-protocol.cancelProcess: процесс ${processId} не найден`);
  }

  try {
    //Процесс удаляется из списка процессов.
    await processes.delete(processId);

    log.warn(`Robust-protocol.cancelProcess: процесс ${processId} отменен`);
    //TODO
    //Файлы этого процесса, ранее записанные в папку PREPARED, удаляются.
    //Ошибки, которые могут возникнуть при удалении файлов, подавляются.
    //Сообщения о них выводятся в лог системы.
  } catch (err) {
    log.error(`Robust-protocol.cancelProcess: процесс ${processId} не удалось удалить`);
  }

  //1. Переводим процесс в состояние CLEANUP.
  await processes.update({
    ...process,
    status: 'CLEANUP',
  });

  try {
    //TODO
    //2. Полученные файлы переносятся из папки PREPARED в MESSAGES.
    //3. Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
    //4. Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
    //5. Файлы, при обработке которых возник dead lock, мы не трогаем.
    //   Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.
  } catch (err) {
    //Если файлы не удается переместить -- об этом делается запись в логе сервера сообщений.
    //Процесс остается в списке. Его статус меняется на FAILED.
    //Такая ситуация требует вмешательства системного администратора.
    await processes.update({
      ...process,
      status: 'FAILED',
    });
  }

  return {
    status: 'OK',
  };
};

export { findOne, findAll, addOne, deleteOne, FindMany, deleteAll };
