import { readFileSync, writeFileSync, renameSync, readdirSync } from 'fs';

import path from 'path';

import { IFiles, IMessage, IProcess, IMessageReturn } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

import config from '../../config';

export let processList: IProcess[];

const basePath = path.join(config.FILES_PATH, '/.DB');

export const loadProcessList = () => {
  const rawData = readFileSync(basePath).toString();
  processList = JSON.parse(rawData);
};

export const saveProcessList = () => {
  writeFileSync(basePath, JSON.stringify(processList, undefined, 2));
};

/**
 * Можем ли мы начать новый процесс. Вернет Истина, если да, Ложь, если уже идет процесс.
 * Если нет -- будеми сообщать Гедымину, что состояние BUSY.
 */
export const checkProcess = (companyId: string) => {
  return processList.find((p) => p.companyId === companyId);
};

export const readFileByAppSystem = (pathDb: string, fileName: string, appSystem: string): IMessage | undefined => {
  const fullName = path.join(pathDb, fileName);
  const data: IMessage = JSON.parse(readFileSync(fullName, { encoding: 'utf8' }));
  return data.head.appSystem === appSystem ? data : undefined;
};

export const getFiles = (companyId: string, appSystem: string, consumerId: string): IMessageReturn | undefined => {
  const resObj: IMessageReturn = {
    fileNames: [],
    messages: [],
  };
  const pathDb = path.join(basePath, `DB_${companyId}/messages/`);
  const consumerFiles = readdirSync(pathDb).filter((item) => item.indexOf(`to_${consumerId}`) > 0);
  for (; consumerFiles.length; ) {
    const fn = consumerFiles.shift();
    if (fn) {
      const message = readFileByAppSystem(pathDb, fn, appSystem);
      if (message) {
        resObj.fileNames.push(fn);
        resObj.messages.push(message);
      }
    }
  }
  return resObj;
};

export const startProcess = (companyId: string, appSystem: string, files: IFiles) => {
  const newProcess: IProcess = {
    id: uidv1(),
    dateBegin: new Date(),
    companyId,
    appSystem,
    status: 'STARTED',
    preparedFiles: Object.keys(files),
    processedFiles: [],
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

export const updateProcess = (processId: string, preparedFiles: IFiles) => {
  const process = processList.find((p) => p.id === processId);

  const updatedProcess = {
    ...process,
    status: 'READY_TO_COMMIT',
    preparedFiles,
  };

  // перемещение файлов
  for (; process!.preparedFiles.length; ) {
    const fn = process!.preparedFiles.shift();
    renameSync('/prepared/' + fn, '/messages/' + fn);
    saveProcessList();
  }
};

export const cleanUpProcess = (processId: string) => {
  const process = processList.find((p) => p.id === processId);

  // const pf = [...process!.preparedFiles];

  // перемещение файлов
  for (; process!.preparedFiles.length; ) {
    const fn = process!.preparedFiles.shift();
    renameSync('/prepared/' + fn, '/messages/' + fn);
    saveProcessList();
  }
};
