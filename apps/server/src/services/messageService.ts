import { IMessage } from '../../../common';
import { messages } from './dao/db';

const findOne = async (id: string) => {
  return messages.find(id);
};

const findAll = async () => {
  return messages.read();
};

/**
 * Возвращает все сообщения по пользователю и организации
 * @param {string} appSystem - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @param {string} userId - идентификатор пользователя
 * @return массив сообщений
 * */
const FindMany = async ({ appSystem, companyId, userId }: { appSystem: string; companyId: string; userId: string }) => {
  return (await messages.read()).filter(
    i => i.head.appSystem === appSystem && i.head.companyid === companyId && i.head.consumer === userId,
  );
};

/**
 * Добавляет одно сообщение
 * @param {string} head - заголовок сообщения
 * @param {string} body - тело сообщения
 * @return id, идентификатор сообщения
 * */

const addOne = async (msgObject: IMessage) => {
  if (await messages.find(i => i.head.id === msgObject.head.id)) {
    throw new Error('сообщение с таким идентификатором уже добавлено');
  }

  return await messages.insert(msgObject);
};

/**
 * Обновляет одно сообщение
 * @param {IMessage} message - сообщение
 * @return id, идентификатор сообщения
 * */
const updateOne = async (message: IMessage) => {
  const oldMessage = await messages.find(i => i.id === message.id);

  if (!oldMessage) {
    throw new Error('сообщение не найдено');
  }

  // Удаляем поля которые нельзя перезаписывать
  delete message.id;

  await messages.update({ ...oldMessage, ...message });

  return message.id;
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
    message => message.head.companyid === companyId && message.head.consumer === userId && message.head.id === uid,
  );

  if (!messageObj) {
    throw new Error('сообщение не найдено');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return messages.delete(messageObj.id!);
};

const deleteAll = async (): Promise<void> => messages.deleteAll();

export { findOne, findAll, addOne, deleteOne, updateOne, FindMany, deleteByUid, deleteAll };
