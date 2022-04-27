/* eslint-disable max-len */
import { readFileSync, writeFileSync, accessSync, constants, renameSync } from 'fs';

import path from 'path';

import { IFiles, IProcess } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

import log from '../utils/logger';

import config from '../../config';
import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

export let processList: IProcess[];

const checkFileSync = (path: string) => {
  try {
    accessSync(path, constants.R_OK | constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};

let processPath = '';

// const processPath = path.join(getDb().dbPath, 'processes.json');

export const loadProcessList = () => {
  processPath = path.join(getDb().dbPath, 'processes.json');
  if (checkFileSync(processPath)) {
    processList = JSON.parse(readFileSync(processPath).toString());
  } else {
    // writeFileSync(processPath, '[]');
    processList = [];
  }
};

export const saveProcessList = () => {
  writeFileSync(processPath, JSON.stringify(processList, undefined, 2));
};

export const updateProcessInList = (process: IProcess) => {
  //processList.map((p) => (p.id === process.id ? process : p));
  const xid = processList.findIndex((p) => p.id === process.id);
  processList.splice(xid, 1, process);
  saveProcessList();
};

export const removeProcessFromList = (processId: string) => {
  const xid = processList.findIndex((p) => p.id === processId);
  processList.splice(xid, 1);
  saveProcessList();
};

export const cleanupProcess = (process: IProcess) => {
  const processedFilesObj = Object.entries(process!.processedFiles!);
  const pathFiles = path.join(getDb().dbPath, `DB_${process!.companyId}/${process!.appSystem}`);

  const requestFiles: { [id: string]: string } = {};
  process.files.forEach((f) => (requestFiles[f.split('_')[0]] = f));

  for (const [fn, status] of processedFilesObj) {
    try {
      renameSync(`${pathFiles}/prepared/${fn}`, `${pathFiles}/messages/${fn}`);
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      log.warn(`Robust-protocol.cleanupProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`);
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
        log.warn(`Robust-protocol.cleanupProcess: не удалось перенести файл ${requestFN} из MESSAGES,
          ${err instanceof Error ? err.message : 'ошибка'}`);
      }
    }
  }
};

export const unknownProcess = (process: IProcess) => {
  const processedFilesObj = Object.entries(process!.processedFiles!);
  const pathFiles = path.join(getDb().dbPath, `DB_${process!.companyId}/${process!.appSystem}`);

  const requestFiles: { [id: string]: string } = {};
  process.files.forEach((f) => (requestFiles[f.split('_')[0]] = f));

  for (const [fn, status] of processedFilesObj) {
    try {
      renameSync(`${pathFiles}/prepared/${fn}`, `${pathFiles}/unknown/${fn}`);
      delete process.processedFiles![fn];
      saveProcessList();
    } catch (err) {
      log.warn(`Robust-protocol.unknownProcess: не удалось перенести файл ${fn} из PREPARED,
          ${err instanceof Error ? err.message : 'ошибка'}`);
    }

    const id = fn.split('_')[0];
    const requestFN = requestFiles[id];
    const toPath = status === 'PROCESSED' ? 'unknown' : status === 'PROCESSED_INCORRECT' ? 'error' : undefined;

    if (toPath && requestFN) {
      try {
        renameSync(`${pathFiles}/messages/${requestFN}`, `${pathFiles}/${toPath}/${requestFN}`);

        const i = process.files.indexOf(requestFN);
        process.files.splice(i, 1);
        saveProcessList();
      } catch (err) {
        log.warn(`Robust-protocol.unknownProcess: не удалось перенести файл ${requestFN} из MESSAGES,
          ${err instanceof Error ? err.message : 'ошибка'}`);
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
          (new Date().getTime() - new Date(process.dateBegin).getTime()) / 60000 >
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
          (new Date().getTime() - new Date(process.dateReadyToCommit!).getTime()) / 60000 >
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

/**
 * Можем ли мы начать новый процесс. Вернет Истина, если да, Ложь, если уже идет процесс.
 * Если нет -- будеми сообщать Гедымину, что состояние BUSY.
 */
export const checkProcess = (companyId: string) => {
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
