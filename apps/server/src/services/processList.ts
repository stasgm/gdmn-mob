import { readFileSync, writeFileSync, renameSync, readdirSync, unlinkSync } from 'fs';

import path from 'path';

import { IFiles, IMessage, IProcess } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

import log from '../utils/logger';
import config from '../../config';

export let processList: IProcess[];

const basePath = path.join(config.FILES_PATH, '/.DB');
const processPath = path.join(basePath, 'processes.json');

export const loadProcessList = () => {
  const rawData = readFileSync(processPath).toString();
  processList = JSON.parse(rawData);
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

export const setProcessFailed = (process: IProcess) => {
  updateProcessInList({
    ...process,
    status: 'FAILED',
  });
  saveProcessList();
};

/**
 * Можем ли мы начать новый процесс. Вернет Истина, если да, Ложь, если уже идет процесс.
 * Если нет -- будеми сообщать Гедымину, что состояние BUSY.
 */
export const checkProcess = (companyId: string) => {
  return processList.find((p) => p.companyId === companyId);
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

export const startProcess = (companyId: string, appSystem: string, files: IFiles) => {
  const newProcess: IProcess = {
    id: uidv1(),
    dateBegin: new Date(),
    companyId,
    appSystem,
    status: 'STARTED',
    fileNames: Object.keys(files),
    processedFileNames: [],
    dateReadyToCommit: undefined,
  };

  processList.push(newProcess);

  saveProcessList();

  return newProcess;
};

export const getProcessById = (processId: string) => {
  const process = processList.find((p) => p.id === processId);

  return process;
};

/**
 *
 * @param processId
 * @param processedFiles
 */
export const updateProcess = (processId: string, processedFiles: IFiles) => {
  const process = getProcessById(processId);

  const processedFileNames = Object.keys(processedFiles);

  const updatedProcess: IProcess = {
    ...process!,
    status: 'READY_TO_COMMIT',
    processedFileNames,
    processedFiles,
  };

  console.log('updatedProcess', updatedProcess);

  //Полученный список ИД обработанных сообщений со статусами их обработки фиксируется в объекте процесса.
  updateProcessInList(updatedProcess);

  //Формируются файлы и записываются синхронно в папку PREPARED.
  for (; process!.fileNames.length; ) {
    const fn = process!.fileNames.shift();
    try {
      const pathFiles = path.join(basePath, `DB_${process!.companyId}/${process!.appSystem}`);
      renameSync(`${pathFiles}/messages/${fn}`, `${pathFiles}/prepared/${fn}`);
      saveProcessList();
    } catch (err) {
      log.error(`Robust-protocol.updateProcess: файл ${fn} не удалось перенести в папку PREPARED`);
    }
  }
};

/**
 *
 * @param processId
 */
export const cleanUpProcess = (processId: string) => {
  const process = getProcessById(processId);

  console.log(11111);

  //Переводит процесс в состояние CLEANUP.
  const updatedProcess: IProcess = {
    ...process!,
    status: 'CLEANUP',
  };

  updateProcessInList(updatedProcess);

  console.log(5555, process!.fileNames);

  saveProcessList();

  //Полученные файлы переносятся из папки PREPARED в MESSAGES.
  for (; process!.fileNames.length; ) {
    const fn = process!.fileNames.shift();
    console.log('fn', fn);
    const pathFiles = path.join(basePath, `DB_${process!.companyId}/${process!.appSystem}`);
    console.log('pathFiles', pathFiles);
    renameSync(`${pathFiles}/prepared/${fn}`, `${pathFiles}/messages/${fn}`);
    saveProcessList();
  }

  if (!process?.processedFiles) {
    return;
  }

  console.log(6666);

  const processedFileList = Object.entries(process.processedFiles);

  //Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
  //Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
  //Файлы, при обработке которых возник dead lock, мы не трогаем.
  //Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.
  for (; processedFileList.length; ) {
    const [fn, f] = processedFileList.shift()!;
    const pathFiles = path.join(basePath, `DB_${process!.companyId}/${process!.appSystem}`);
    if (f.status !== 'PROCESSED_DEADLOCK' && f.status !== 'PROCESSED_INCORRECT') {
      renameSync(`${pathFiles}/messages/${fn}`, `${pathFiles}/log/${fn}`);
      saveProcessList();
    } else if (f.status === 'PROCESSED_INCORRECT') {
      renameSync(`${pathFiles}/messages/${fn}`, `${pathFiles}/error/${fn}`);
      saveProcessList();
    }
  }
};

/**
 *
 * @param processId
 */
export const cancelProcess = (processId: string) => {
  const process = getProcessById(processId);

  //Файлы этого процесса, ранее записанные в папку PREPARED, удаляются.
  //Ошибки, которые могут возникнуть при удалении файлов, подавляются. Сообщения о них выводятся в лог системы.
  for (; process!.processedFileNames.length; ) {
    const fn = process!.processedFileNames.shift();
    try {
      const pathFiles = path.join(basePath, `/DB_${process!.companyId}/${process!.appSystem}`);
      unlinkSync(`${pathFiles}/prepared/${fn}`);
      saveProcessList();
    } catch {
      log.error(`Robust-protocol.cancelProcess: файл ${fn} не удалось удалить`);
    }
  }
};
