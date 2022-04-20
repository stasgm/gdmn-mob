import { IDBMessage, IGetProcessResponse, IMessage, IProcess, IUpdateProcessResponse, NewMessage } from '@lib/types';
import { v1 as uuidv1 } from 'uuid';

import { DataNotFoundException } from '../exceptions';

import log from '../utils/logger';

import { getDb } from './dao/db';
import { FindMany } from './messageService';
import { checkProcess, getFiles, getProcessById, IFiles, startProcess } from './processList';

/**
 * 1. Если есть процесс для данной базы, то возвращает status 'BUSY'
   2. Если нет процесса и нет сообщений для данного клиента, то возвращает status 'OK' и messages = []
   3. Если нет процесса и есть сообщения, то status 'OK', processId и список сообщений
 * @param companyId
 * @param appSystem
 * @param consumerId
 * @returns { status, processId, messages }
 */
export const getProcess = (companyId: string, appSystem: string, consumerId: string): IGetProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = checkProcess(companyId);

  //Если процесс существует, то возвращаем status = BUSY
  if (process) {
    return { status: 'BUSY' };
  }

  //Находим список наименований файлов и список сообщений
  const files = getFiles(companyId, appSystem, consumerId);

  //Если нет процесса и нет сообщений для данного клиента, то status 'OK' и messages = []
  if (!files) {
    return { status: 'OK', files: [] };
  }

  //Если нет процесса и есть сообщения, создаем процесс
  const newProcess = startProcess(companyId, appSystem, files);

  return {
    status: 'OK',
    processId: newProcess.id,
    files,
  };
};

export const updateProcess = (processId: string, messages: IMessage[]): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

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
