import path from 'path';
import { readFileSync, writeFileSync, renameSync, readdirSync, unlinkSync } from 'fs';

import { IFiles, IAddProcessResponse, IUpdateProcessResponse, AddProcess, IMessage, IProcessedFiles } from '@lib/types';

import log from '../utils/logger';

import config from '../../config';

import {
  checkProcess,
  getProcessById,
  removeProcessFromList,
  saveProcessList,
  startProcess,
  updateProcessInList,
} from './processList';

const basePath = path.join(config.FILES_PATH, '/.DB');

export const saveFile = (filePath: string, data: IMessage) => {
  writeFileSync(filePath, JSON.stringify(data, undefined, 2));
};

export const deleteFile = (filePath: string) => {
  unlinkSync(filePath);
};

export const readFileByAppSystem = (pathDb: string, fileName: string): IMessage => {
  const fullName = path.join(pathDb, fileName);
  return JSON.parse(readFileSync(fullName, { encoding: 'utf8' }));
};

export const getFiles = (companyId: string, appSystem: string, consumerId: string): IFiles => {
  const pathDb = path.join(basePath, `DB_${companyId}/${appSystem}/messages/`);
  console.log('111 pathDb', pathDb);
  const consumerFiles = readdirSync(pathDb).filter((item) => item.indexOf(`to_${consumerId}`) > 0);

  return consumerFiles?.reduce((prev: IFiles, cur) => {
    prev[cur] = readFileByAppSystem(pathDb, cur);
    return prev;
  }, {});
};

/**
 * 1. Если есть процесс для данной базы, то возвращает status 'BUSY'
   2. Если нет процесса и нет сообщений для данного клиента, то возвращает status 'OK' и messages = []
   3. Если нет процесса и есть сообщения, то status 'OK', processId и список сообщений
 * @param companyId
 * @param appSystem
 * @param consumerId
 * @returns { status, processId, messages }
 */
export const addProcess = ({ companyId, appSystem, consumerId }: AddProcess): IAddProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = checkProcess(companyId);

  //Если процесс существует, то возвращаем status = BUSY
  if (process) {
    log.warn(`Robust-protocol.updateProcess: процесс ${process.id} занят`);
    return { status: 'BUSY', processId: process.id };
  }

  //Находим список наименований файлов и список сообщений
  const files = getFiles(companyId, appSystem, consumerId);

  // //Если нет процесса и нет сообщений для данного клиента, то status 'OK' и messages = []
  // if (!files) {
  //   return { status: 'IDLE' };
  // }

  //Если нет процесса и есть сообщения, создаем процесс
  const newProcess = startProcess(companyId, appSystem, files);

  return {
    status: 'OK',
    processId: newProcess.id,
    files,
  };
};

export const updateProcessById = (processId: string, processedFiles: IFiles): IUpdateProcessResponse => {
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

  //Если процесс есть в списке в состоянии STARTED, то:
  // 1. Ему присваивается состояние READY_TO_COMMIT.
  // 2. Полученный список ИД обработанных сообщений со статусами их обработки фиксируется в объекте процесса.
  // 3. Формируются файлы и записываются синхронно в папку PREPARED.

  const pathFiles = path.join(basePath, `DB_${process!.companyId}/${process!.appSystem}`);
  const processedFilesObj = Object.entries(processedFiles);

  let written;
  let error = '';

  const statusFiles: IProcessedFiles = {};

  for (written = 0; written < processedFilesObj.length; written++) {
    const [fn, mes] = processedFilesObj[written];
    statusFiles[fn] = mes.status;
    if (mes.status === 'PROCESSED_INCORRECT' || mes.status === 'PROCESSED_DEADLOCK') {
      log.warn(`Robust-protocol.updateProcess: сообщение ${mes.id} обработано со статусом ${mes.status}`);
    }
    try {
      saveFile(`${pathFiles}/prepared/${fn}`, mes);
    } catch (err) {
      error = `Robust-protocol.updateProcess: не удалось создать файл ${fn} в папке PREPARED,
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

export const completeProcessById = (processId: string): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не READY_TO_COMMIT,
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.removeProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.removeProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
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
  const pathFiles = path.join(basePath, `DB_${process!.companyId}/${process!.appSystem}`);

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
    const toPatch = status === 'PROCESSED' ? 'log' : status === 'PROCESSED_INCORRECT' ? 'error' : undefined;
    if (toPatch && requestFN) {
      try {
        renameSync(`${pathFiles}/messages/${requestFN}`, `${pathFiles}/${toPatch}/${requestFN}`);

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

export const cancelProcessById = (processId: string, errorMessage: string): IUpdateProcessResponse => {
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
  const pathFiles = path.join(basePath, `/DB_${process!.companyId}/${process!.appSystem}`);

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

export const interruptProcessById = (processId: string, errorMessage: string): IUpdateProcessResponse => {
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
