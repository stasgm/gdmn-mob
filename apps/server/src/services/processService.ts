/* eslint-disable max-len */

import { unlinkSync, renameSync } from 'fs';

import { IAddProcessResponse, IStatusResponse, AddProcess, IProcessedFiles, NewMessage } from '@lib/types';

import log from '../utils/logger';

import { DataNotFoundException, ForbiddenException, InnerErrorException } from '../exceptions';

import { messageFileName2params, params2messageFileName } from '../utils/json-db/MessageCollection';

import {
  getProcessByCompanyId,
  getProcessById,
  getProcesses,
  removeProcessFromList,
  saveProcessList,
  startProcess,
  replaceProcessInList,
  getPathPrepared,
  getPathMessages,
  getPathError,
  getPathLog,
  deleteFile,
  saveFile,
  makeDBNewMessageSync,
  getFiles,
} from './processList';
import { getDb } from './dao/db';

/**
 * API 1. Создает процесс, возвращает файлы для обработки
   1. Если есть процесс для данной базы, то возвращает status 'BUSY'
   2. Если нет процесса и нет сообщений для данного клиента, то возвращает status 'OK' и messages = []
   3. Если нет процесса и есть сообщения, то status 'OK', processId и список сообщений
 * @param params
 * @returns { status, processId, files }
 */
export const addOne = (params: AddProcess): IAddProcessResponse => {
  const { companies, users } = getDb();
  const { companyId, consumerId } = params;

  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (!users.findById(consumerId)) {
    throw new DataNotFoundException('Получатель не найден');
  }

  // Находим процесс для конкретной базы
  const process = getProcessByCompanyId(companyId);

  //Если процесс существует, то возвращаем status = BUSY
  if (process) {
    log.warn(`Robust-protocol.addProcess: процесс ${process.id} занят`);
    return { status: 'BUSY', processId: process.id };
  }

  //Находим список файлов для обработки
  const files = getFiles(params);

  //Если нет процесса и есть сообщения, создаем процесс
  const newProcess = startProcess(params.companyId, params.appSystemId, files);

  return {
    status: 'OK',
    processId: newProcess.id,
    files,
  };
};

/**
 * API 2. Обновляет список файлов для обработки
 * @param processId
 * @param files
 * @returns
 */
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

  replaceProcessInList({
    ...process,
    files,
  });

  return { status: 'OK' };
};

/**
 * API 3. Записывает на диск подготовленные файлы для ответа
 * @param params  {processId: string; producerId: string; processedFiles: NewMessage[]}
 * @returns
 */
export const prepareById = ({
  processId,
  producerId,
  processedFiles,
}: {
  processId: string;
  producerId: string;
  processedFiles: NewMessage[];
}): IStatusResponse => {
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

  const written: string[] = [];
  const statusFiles: IProcessedFiles = {};

  for (const mes of processedFiles) {
    const newMes = makeDBNewMessageSync(mes, producerId);
    const newFn = params2messageFileName({ id: newMes.id, producerId: producerId, consumerId: newMes.head.consumerId });

    if (newMes.status === 'PROCESSED_INCORRECT' || newMes.status === 'PROCESSED_DEADLOCK') {
      log.warn(`Robust-protocol.prepareProcess: сообщение ${newMes.id} обработано со статусом ${newMes.status}`);
    }

    try {
      const fullFileName = getPathPrepared(process, newFn);
      saveFile(fullFileName, newMes);
      written.push(fullFileName);
      statusFiles[newFn] = { replyTo: newMes.head.replyTo, status: newMes.status };
    } catch (err) {
      log.error(`Robust-protocol.prepareProcess: не удалось создать файл ${newFn} в папке PREPARED,
        ${err instanceof Error ? err.message : 'ошибка'}`);

      try {
        written.forEach(deleteFile);
      } catch {
        //здесь мы просто подавляем ошибку
      }

      return { status: 'CANCELLED' };
    }
  }

  replaceProcessInList({
    ...process,
    status: 'READY_TO_COMMIT',
    dateReadyToCommit: new Date(),
    processedFiles: statusFiles,
  });

  return { status: 'OK' };
};

/**
 * API 4. Завершает успешный процесс, если состояние 'READY_TO_COMMIT'.
 Переносит подготовленные файлы с ответом в папку messages или error
 * @param processId
 * @returns
 */
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

  if (!process.processedFiles) {
    log.error(`Robust-protocol.completeProcess: в процессе ${processId} массив обработанных файлов пуст`);
    throw new InnerErrorException('Should never be here');
  }

  //1. Переводим процесс в состояние CLEANUP.
  //2. Полученные файлы переносятся из папки PREPARED в MESSAGES.
  //3. Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
  //4. Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
  //5. Файлы, при обработке которых возник dead lock, мы не трогаем.
  //   Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.

  replaceProcessInList({ ...process, status: 'CLEANUP' });

  let error = '';
  const processedFilesObj = Object.entries(process.processedFiles);

  const requestFiles: { [id: string]: string } = {};
  process.files.forEach((fn) => (requestFiles[messageFileName2params(fn).id] = fn));

  for (const [fn, mes] of processedFilesObj) {
    try {
      renameSync(getPathPrepared(process, fn), getPathMessages(process, fn));
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      error = `Robust-protocol.completeProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`;
      break;
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
          error = `Robust-protocol.completeProcess: не удалось перенести файл ${requestFN} из MESSAGES,
            ${err instanceof Error ? err.message : 'ошибка'}`;
          break;
        }
      }
    }
  }

  if (error) {
    log.error(error);

    replaceProcessInList({ ...process, status: 'FAILED' });

    return { status: 'CANCELLED' };
  }

  // По успешному переносу процесс удаляется из списка процессов.
  removeProcessFromList(processId);

  return {
    status: 'OK',
  };
};

/**
 * API 5. Удаляет процесс в случае возникновения ошибок при коммите транзакции, если было состояние 'READY_TO_COMMIT'.
   Подготовленные файлы удаляются
 * @param processId
 * @param errorMessage
 * @returns
 */
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

  if (!process.processedFiles) {
    log.error(`Robust-protocol.completeProcess: в процессе ${processId} массив обработанных файлов пуст`);
    throw new InnerErrorException('Should never be here');
  }

  //Файлы этого процесса, ранее записанные в папку PREPARED, удаляются.
  //Ошибки, которые могут возникнуть при удалении файлов, подавляются. Сообщения о них выводятся в лог системы.
  const processedFilesObj = Object.keys(process.processedFiles);

  for (const fn of processedFilesObj) {
    try {
      unlinkSync(getPathPrepared(process, fn));
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

/**
 * API 6. Удаляет процесс в случае возникновения ошибок, если состояние 'STARTED'
 * @param processId
 * @param errorMessage
 * @returns
 */
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
 * Возвращает множество процессов
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
  if (!process || (process.status !== 'STARTED' && process.status !== 'FAILED')) {
    if (!process) {
      log.warn(`Robust-protocol.deleteProcess: процесс ${processId} не найден`);
      throw new DataNotFoundException('Процесс не найден');
    } else {
      log.warn(`Robust-protocol.deleteProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
      throw new ForbiddenException(`Процесс не может быть удален, его состояние ${process.status}`);
    }
  }

  //Cервер сообщений удаляет процесс из списка процессов и делает соответствующую запись в логе.
  switch (process.status) {
    case 'STARTED':
    case 'FAILED':
      removeProcessFromList(processId);
  }

  log.warn(`Robust-protocol.deleteProcess: процесс ${processId} удален вручную`);
};
