/* eslint-disable max-len */
import path from 'path';

import { readFileSync, writeFileSync, readdirSync, unlinkSync, statSync, renameSync, accessSync, constants } from 'fs';

import { v1 as uidv1 } from 'uuid';
import { IFiles, IProcess, AddProcess, IMessage, IDBMessage, isIDBMessage, NewMessage } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import log from '../utils/logger';

import config from '../../config';

import { InnerErrorException } from '../exceptions';

import { BYTES_PER_MB, defMaxDataVolume, defMaxFiles, MSEС_IN_MIN } from '../utils/constants';

import { messageFileName2params } from '../utils/json-db/MessageCollection';

import { getDb } from './dao/db';
import { getNamedEntitySync } from './dao/utils';

export let processList: IProcess[];

let processPath = '';

export const initProcessList = () => {
  processPath = path.join(getDb().dbPath, 'processes.json');
  checkPath(processPath);
  processList = JSON.parse(readFileSync(processPath).toString());
};

export const saveProcessList = () => {
  writeFileSync(processPath, JSON.stringify(processList, undefined, 2));
};

/**
 * Важно! функция меняет САМ массив процессов. Любой код, который использует
 * массив должен быть СИНХРОННЫМ!
 * @param process
 */
export const replaceProcessInList = (process: IProcess) => {
  const idx = processList.findIndex((p) => p.id === process.id);
  if (idx === -1) {
    throw new Error('We should never be here');
  }
  processList[idx] = process;
  saveProcessList();
};

export const removeProcessFromList = (processId: string) => {
  const xid = processList.findIndex((p) => p.id === processId);
  processList.splice(xid, 1);
  saveProcessList();
};

/**
 * Можем ли мы начать новый процесс. Вернет Истина, если да, Ложь, если уже идет процесс.
 * Если нет -- будеми сообщать Гедымину, что состояние BUSY.
 */
export const getProcessByCompanyId = (companyId: string) => {
  return processList.find((p) => p.companyId === companyId);
};

export const startProcess = (companyId: string, appSystem: string, files: IFiles) => {
  const newProcess: IProcess = {
    id: uidv1(),
    dateBegin: new Date(),
    companyId,
    appSystem,
    status: 'STARTED',
    files: Object.keys(files),
  };

  processList.push(newProcess);

  saveProcessList();

  return newProcess;
};

export const getProcessById = (processId: string) => {
  const process = processList.find((p) => p.id === processId);

  return process;
};

export const getProcesses = (params: Record<string, string>) => {
  return processList.filter((item) => extraPredicate(item, params));
};

interface ISystemParams {
  companyId: string;
  appSystem: string;
}

const getPath = (folders: string[], fn = '') => {
  const folderPath = path.join(getDb().dbPath, ...folders);
  checkPath(folderPath);
  return path.join(folderPath, fn);
};

export const getPathSystem = ({ companyId, appSystem }: ISystemParams) => `DB_${companyId}/${appSystem}`;

export const getPathPrepared = (params: ISystemParams, fn = '') => getPath([getPathSystem(params), 'prepared'], fn);
export const getPathMessages = (params: ISystemParams, fn = '') => getPath([getPathSystem(params), 'messages'], fn);
export const getPathLog = (params: ISystemParams, fn = '') => getPath([getPathSystem(params), 'log'], fn);
export const getPathUnknown = (params: ISystemParams, fn = '') => getPath([getPathSystem(params), 'unknown'], fn);
export const getPathError = (params: ISystemParams, fn = '') => getPath([getPathSystem(params), 'error'], fn);

export const cleanupProcess = (process: IProcess) => {
  if (!process.processedFiles) {
    log.error(`Robust-protocol.cleanupProcess: в процессе ${process.id} массив обработанных файлов пуст`);
    return;
  }

  const processedFilesObj = Object.entries(process.processedFiles);

  const requestFiles: { [id: string]: string } = {};

  process.files.forEach((fn) => (requestFiles[messageFileName2params(fn).id] = fn));

  for (const [fn, mes] of processedFilesObj) {
    try {
      renameSync(getPathPrepared(process, fn), getPathMessages(process, fn));
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      log.warn(`Robust-protocol.cleanupProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`);
    }

    if (mes.replyTo) {
      const requestFN = requestFiles[mes.replyTo];
      const toPath =
        mes.status === 'PROCESSED' || mes.status === 'READY'
          ? getPathLog(process, requestFN)
          : mes.status === 'PROCESSED_INCORRECT'
          ? getPathError(process, requestFN)
          : undefined;

      if (toPath && requestFN) {
        try {
          renameSync(getPathMessages(process, requestFN), toPath);

          const i = process.files.indexOf(requestFN);
          process.files.splice(i, 1);
          saveProcessList();
        } catch (err) {
          log.warn(`Robust-protocol.cleanupProcess: не удалось перенести файл ${requestFN} из MESSAGES,
            ${err instanceof Error ? err.message : 'ошибка'}`);
        }
      }
    }
  }
};

export const unknownProcess = (process: IProcess) => {
  if (!process.processedFiles) {
    log.error(`Robust-protocol.unknownProcess: в процессе ${process.id} массив обработанных файлов пуст`);
    return;
  }

  const processedFilesObj = Object.entries(process.processedFiles);

  const requestFiles: { [id: string]: string } = {};
  process.files.forEach((fn) => (requestFiles[messageFileName2params(fn).id] = fn));

  for (const [fn, mes] of processedFilesObj) {
    try {
      renameSync(getPathPrepared(process, fn), getPathUnknown(process, fn));
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      log.warn(`Robust-protocol.unknownProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`);
    }

    if (mes.replyTo) {
      const requestFN = requestFiles[mes.replyTo];

      const toPath =
        mes.status === 'PROCESSED' || mes.status === 'READY'
          ? getPathUnknown(process, requestFN)
          : mes.status === 'PROCESSED_INCORRECT'
          ? getPathError(process, requestFN)
          : undefined;

      if (toPath && requestFN) {
        try {
          renameSync(getPathMessages(process, requestFN), toPath);

          const i = process.files.indexOf(requestFN);
          process.files.splice(i, 1);
          saveProcessList();
        } catch (err) {
          log.warn(`Robust-protocol.unknownProcess: не удалось перенести файл ${requestFN} из MESSAGES,
            ${err instanceof Error ? err.message : 'ошибка'}`);
        }
      }
    }
  }
};

export const checkProcessList = (isStart = false) => {
  console.log('ProcessList check', isStart);
  for (const process of processList) {
    switch (process.status) {
      //Записи в состоянии STARTED удаляются.
      case 'STARTED': {
        if (
          (new Date().getTime() - new Date(process.dateBegin).getTime()) / MSEС_IN_MIN >
          config.PROCESS_CHECK_PERIOD_IN_MIN
        ) {
          removeProcessFromList(process.id);
          log.warn(
            `Robust-protocol.check: процесс ${process.id} удален, завис со статусом STARTED > ${config.PROCESS_CHECK_PERIOD_IN_MIN} мин.`,
          );
        }
        break;
      }
      //Записи в состоянии CLEANUP удаляются из списка,
      //а перечисленные в них файлы перемещаются в папки LOG, MESSAGES и ERROR соответственно.
      case 'CLEANUP': {
        if (isStart) {
          cleanupProcess(process);
          removeProcessFromList(process.id);
          log.error(`Robust-protocol.check: процесс ${process.id} удален, завис со статусом CLEANUP`);
        }
        break;
      }
      //Записи в состоянии READY_TO_COMMIT говорят нам о том, что мы не знаем точно прошел ли комит на базе данных.
      //О таких записях надо обязательно информировать системного администратора,
      //а перечисленные в них файлы (как файлы из папки MESSAGES, так и файлы из папки PREPARED) должны быть перемещены
      //в папку UNKNOWN, но не удалены с диска. Файлы, при обработке которых произошла ошибка переносятся в папку ERROR.
      //Файлы, при обработке которых произошел dead lock мы оставляем в исходном состоянии.
      //Такая ситуация требует вмешательства системного администратора. Сама запись процесса удаляется из списка.
      case 'READY_TO_COMMIT': {
        if (
          (new Date().getTime() - new Date(process.dateReadyToCommit!).getTime()) / MSEС_IN_MIN >
          config.PROCESS_CHECK_PERIOD_IN_MIN
        ) {
          unknownProcess(process);
          removeProcessFromList(process.id);
          log.error(
            `Robust-protocol.check: процесс ${process.id} удален, завис со статусом READY_TO_COMMIT > ${config.PROCESS_CHECK_PERIOD_IN_MIN} мин.`,
          );
        }
        break;
      }
    }
  }
};

const checkPath = (filePath: string) => {
  try {
    accessSync(filePath, constants.R_OK | constants.W_OK);
  } catch (err) {
    log.error(`Robust-protocol.checkPath: файл ${filePath} не найден!`);
    throw new Error(`Файл ${filePath} не найден!`);
  }
};

export const saveFile = (filePath: string, data: IDBMessage) => {
  writeFileSync(filePath, JSON.stringify(data, undefined, 2));
};

export const deleteFile = (filePath: string) => {
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

export const getFiles = (params: AddProcess): IFiles => {
  const pathDb = getPathMessages(params);

  //Находим все подходящие файлы
  let files = readdirSync(pathDb).filter((fn) => fn.includes(`_to_${params.consumerId}`));

  if (params.producerIds) {
    files = params.producerIds.flatMap((prId) => files.filter((fn) => fn.includes(`from_${prId}_to`)));
  }

  const sorted = files
    .map<[string, IMessage]>((fn) => [fn, makeMessageSync(readMessageFile(pathDb, fn))])
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

export const makeMessageSync = (message: IDBMessage): IMessage => {
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

export const makeDBNewMessageSync = (message: NewMessage, producerId: string): IDBMessage => {
  return {
    id: uidv1(),
    head: {
      appSystem: message.head.appSystem,
      companyId: message.head.company.id,
      consumerId: message.head.consumer.id,
      producerId,
      dateTime: new Date().toISOString(),
      replyTo: message.head.replyTo,
    },
    status: message.status,
    body: message.body,
  };
};
