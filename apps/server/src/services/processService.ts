import path from 'path';

import { readFileSync, writeFileSync, readdirSync, unlinkSync, statSync, renameSync, accessSync, constants } from 'fs';

import {
  IFiles,
  IAddProcessResponse,
  IStatusResponse,
  AddProcess,
  IMessage,
  IProcessedFiles,
  IDBMessage,
  NewProcessMessage,
  isIDBMessage,
} from '@lib/types';
import { v1 as uidv1 } from 'uuid';

import log from '../utils/logger';

import config from '../../config';

import { DataNotFoundException, InnerErrorException } from '../exceptions';

import { BYTES_PER_MB, defMaxDataVolume, defMaxFiles } from '../utils/constants';

import {
  checkProcess,
  getProcessById,
  getProcesses,
  removeProcessFromList,
  saveProcessList,
  startProcess,
  updateProcessInList,
} from './processList';
import { getDb } from './dao/db';
import { getNamedEntitySync } from './dao/utils';

const getPath = (folder: string) => {
  const p = path.join(getDb().dbPath, folder);
  checkPath(p);
  return p;
};

const checkPath = (filePath: string) => {
  try {
    accessSync(filePath, constants.F_OK);
  } catch (err) {
    log.error(`Robust-protocol.getPath: файл ${filePath} не найден!`);
    throw new InnerErrorException(`Файл ${filePath} не найден!`);
  }
};

const saveFile = (filePath: string, data: IDBMessage) => {
  writeFileSync(filePath, JSON.stringify(data, undefined, 2));
};

const deleteFile = (filePath: string) => {
  unlinkSync(filePath);
};

const readMessageFile = (pathDb: string, fileName: string): IDBMessage => {
  const fullName = path.join(pathDb, fileName);
  const data = readFileSync(fullName, { encoding: 'utf8' });
  const parsed = JSON.parse(data);
  if (isIDBMessage(parsed)) {
    return parsed;
  }
  throw new InnerErrorException(`Неверный тип данных в файле ${fullName}`);
};

const getFileSizeInMB = (fileName: string) => {
  checkPath(fileName);
  return statSync(fileName).size / BYTES_PER_MB;
};

const getFiles = (params: AddProcess): IFiles => {
  const pathDb = getPath(`DB_${params.companyId}/${params.appSystem}/messages/`);

  //Находим все подходящие файлы
  let files = readdirSync(pathDb).filter((fn) => fn.includes(`_to_${params.consumerId}`));

  if (params.producerIds) {
    files = params.producerIds.flatMap((prId) => files.filter((fn) => fn.includes(`from_${prId}_to`)));
  }

  const sorted = files
    .map<[string, IMessage]>((fn) => [fn, makeMessage(readMessageFile(pathDb, fn))])
    .sort((a, b) => new Date(a[1].head.dateTime).getTime() - new Date(b[1].head.dateTime).getTime());

  const limitDataVolume = Math.min(
    params.maxDataVolume ?? defMaxDataVolume,
    config.PROCESS_MAX_DATA_VOLUME ?? defMaxDataVolume,
  );
  const limitFiles = Math.min(params.maxFiles ?? defMaxFiles, config.PROCESS_MAX_FILES ?? defMaxFiles);

  let c = 0;
  let dataVolume = 0;

  for (; c < sorted.length && c < limitFiles && dataVolume <= limitDataVolume; c++) {
    dataVolume += getFileSizeInMB(path.join(pathDb, sorted[c][0]));
  }

  return Object.fromEntries(sorted.slice(0, c));
};

/**
 * 1. Если есть процесс для данной базы, то возвращает status 'BUSY'
   2. Если нет процесса и нет сообщений для данного клиента, то возвращает status 'OK' и messages = []
   3. Если нет процесса и есть сообщения, то status 'OK', processId и список сообщений
 * @param params
 * @returns { status, processId, files }
 */
export const addOne = (params: AddProcess): IAddProcessResponse => {
  const { companies, users } = getDb();
  const { companyId, consumerId } = params;

  if (!companies.findSync(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (!users.findSync(consumerId)) {
    throw new DataNotFoundException('Получатель не найден');
  }

  // Находим процесс для конкретной базы
  const process = checkProcess(companyId);

  //Если процесс существует, то возвращаем status = BUSY
  if (process) {
    log.warn(`Robust-protocol.addProcess: процесс ${process.id} занят`);
    return { status: 'BUSY', processId: process.id };
  }

  //Находим список файлов для обработки
  const files = getFiles(params);

  //Если нет процесса и есть сообщения, создаем процесс
  const newProcess = startProcess(params.companyId, params.appSystem, files);

  return {
    status: 'OK',
    processId: newProcess.id,
    files,
  };
};

export const updateById = (processId: string, files: string[]): IStatusResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не STARTED, то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    if (!process) {
      log.warn(`Robust-protocol.updateProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.updateProcess: нельзя изменить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  updateProcessInList({
    ...process,
    files,
  });

  return { status: 'OK' };
};

export const prepareById = (processId: string, processedFiles: IFiles): IStatusResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не STARTED, то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    if (!process) {
      log.warn(`Robust-protocol.prepareProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.prepareProcess: нельзя изменить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  //Если процесс есть в списке в состоянии STARTED, то:
  // 1. Ему присваивается состояние READY_TO_COMMIT.
  // 2. Полученный список ИД обработанных сообщений со статусами их обработки фиксируется в объекте процесса.
  // 3. Формируются файлы и записываются синхронно в папку PREPARED.

  const pathFiles = getPath(`DB_${process!.companyId}/${process!.appSystem}`);
  const processedFilesObj = Object.entries(processedFiles);

  let written;
  let error = '';

  const statusFiles: IProcessedFiles = {};

  for (written = 0; written < processedFilesObj.length; written++) {
    const [fn, mes] = processedFilesObj[written];
    statusFiles[fn] = mes.status;
    if (mes.status === 'PROCESSED_INCORRECT' || mes.status === 'PROCESSED_DEADLOCK') {
      log.warn(`Robust-protocol.prepareProcess: сообщение ${mes.id} обработано со статусом ${mes.status}`);
    }
    try {
      const producerId = fn.split('_')[2];
      const dbMessage = makeDBNewMessage(mes, producerId);
      saveFile(`${pathFiles}/prepared/${fn}`, dbMessage);
    } catch (err) {
      error = `Robust-protocol.prepareProcess: не удалось создать файл ${fn} в папке PREPARED,
        ${err instanceof Error ? err.message : 'ошибка'}`;
      break;
    }
  }

  if (error) {
    log.error(error);

    for (let j = written - 1; j > 0; j--) {
      const [fn] = processedFilesObj[j];
      try {
        deleteFile(`${pathFiles}/prepared/${fn}`);
      } catch {
        //здесь мы просто подавляем ошибку
      }
    }

    return { status: 'CANCELLED' };
  }

  // updateProcess(process.id, statusFiles);
  updateProcessInList({
    ...process,
    status: 'READY_TO_COMMIT',
    dateReadyToCommit: new Date(),
    processedFiles: statusFiles,
  });

  return { status: 'OK' };
};

export const completeById = (processId: string): IStatusResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не READY_TO_COMMIT,
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.completeProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.completeProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  //1. Переводим процесс в состояние CLEANUP.
  //2. Полученные файлы переносятся из папки PREPARED в MESSAGES.
  //3. Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
  //4. Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
  //5. Файлы, при обработке которых возник dead lock, мы не трогаем.
  //   Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.
  // cleanupProcess(processId);

  updateProcessInList({ ...process, status: 'CLEANUP' });

  let error = '';
  const processedFilesObj = Object.entries(process!.processedFiles!);
  const pathFiles = getPath(`DB_${process!.companyId}/${process!.appSystem}`);

  const requestFiles: { [id: string]: string } = {};
  process.files.forEach((f) => (requestFiles[f.split('_')[0]] = f));

  for (const [fn, status] of processedFilesObj) {
    try {
      renameSync(`${pathFiles}/prepared/${fn}`, `${pathFiles}/messages/${fn}`);
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      error = `Robust-protocol.completeProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`;
      break;
    }

    const id = fn.split('_')[0];
    const requestFN = requestFiles[id];
    const toPath =
      status === 'PROCESSED' || status === 'READY' ? 'log' : status === 'PROCESSED_INCORRECT' ? 'error' : undefined;
    if (toPath && requestFN) {
      try {
        renameSync(`${pathFiles}/messages/${requestFN}`, `${pathFiles}/${toPath}/${requestFN}`);

        const i = process.files.indexOf(requestFN);
        process.files.splice(i, 1);
        saveProcessList();
      } catch (err) {
        error = `Robust-protocol.completeProcess: не удалось перенести файл ${requestFN} из MESSAGES,
          ${err instanceof Error ? err.message : 'ошибка'}`;
        break;
      }
    }
  }

  if (error) {
    log.error(error);

    updateProcessInList({ ...process, status: 'FAILED' });

    return { status: 'CANCELLED' };
  }

  // По успешному переносу процесс удаляется из списка процессов.
  removeProcessFromList(processId);

  return {
    status: 'OK',
  };
};

export const cancelById = (processId: string, errorMessage: string): IStatusResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не 'STARTED',
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.cancelProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.cancelProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  //Файлы этого процесса, ранее записанные в папку PREPARED, удаляются.
  //Ошибки, которые могут возникнуть при удалении файлов, подавляются. Сообщения о них выводятся в лог системы.
  const processedFilesObj = Object.keys(process!.processedFiles!);
  const pathFiles = getPath(`/DB_${process!.companyId}/${process!.appSystem}`);

  for (const fn of processedFilesObj) {
    // const fn = process!.processedFiles!.shift();
    try {
      unlinkSync(`${pathFiles}/prepared/${fn}`);
      delete process.processedFiles![fn];
      saveProcessList();
    } catch {
      log.error(`Robust-protocol.cancelProcess: файл ${fn} не удалось удалить из PREPARED`);
    }
  }

  removeProcessFromList(processId);

  log.warn(`Robust-protocol.cancelProcess: процесс ${processId} отменен, ${errorMessage}`);

  return {
    status: 'OK',
  };
};

export const interruptById = (processId: string, errorMessage: string): IStatusResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не 'STARTED',
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    if (!process) {
      log.warn(`Robust-protocol.interruptProcess: процесс ${processId} не найден`);
    } else {
      log.warn(
        `Robust-protocol.interruptProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`,
      );
    }

    return {
      status: 'CANCELLED',
    };
  }
  //Cервер сообщений удаляет процесс из списка процессов и делает соответствующую запись в логе.
  removeProcessFromList(processId);

  log.warn(`Robust-protocol.interruptProcess: процесс ${processId} прерван, ${errorMessage}`);

  return {
    status: 'OK',
  };
};

/**
 *
 * @param params
 * @returns
 */
export const findMany = (params: Record<string, string>) => {
  return getProcesses(params);
};

export const deleteOne = (processId: string) => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД
  //то возвращается статус CANCELLED
  if (!process) {
    log.warn(`Robust-protocol.deleteProcess: процесс ${processId} не найден`);

    return {
      status: 'CANCELLED',
    };
  }
  //Cервер сообщений удаляет процесс из списка процессов и делает соответствующую запись в логе.
  removeProcessFromList(processId);

  log.warn(`Robust-protocol.deleteProcess: процесс ${processId} удален`);

  return {
    status: 'OK',
  };
};

export const makeMessage = (message: IDBMessage): IMessage => {
  const { users, companies } = getDb();

  const consumer = getNamedEntitySync(message.head.consumerId, users);
  const producer = getNamedEntitySync(message.head.producerId, users);
  const company = getNamedEntitySync(message.head.companyId, companies);

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

export const makeDBNewMessage = (message: NewProcessMessage, producerId: string): IDBMessage => {
  return {
    id: message.id || uidv1(),
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
