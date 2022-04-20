import { readFileSync, writeFileSync, renameSync } from 'fs';

import { IMessage, IProcess } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

export let processList: IProcess[];

const basePath = 'DB/.DB';

export interface IFiles {
  names: string[];
  messages: IMessage[];
}

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

export const getFiles = (companyId: string, appSystem: string, consumerId: string): IFiles => {
  return { names: [], messages: [] };
};

export const startProcess = (companyId: string, appSystem: string, preparedFiles: string[]) => {
  const newProcess: IProcess = {
    id: uidv1(),
    dateBegin: new Date(),
    companyId,
    appSystem,
    status: 'STARTED',
    preparedFiles,
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

export const updateProcess = (processId: string, preparedFiles: IMessage[]) => {
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
