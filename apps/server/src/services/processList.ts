import { readFileSync, writeFileSync, renameSync } from 'fs';

import { IMessage, IProcess } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

export let processList: IProcess[];

const basePath = 'DB/.DB';

export interface IGetFiles {
  fileNames: string[];
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

export const getFiles = (companyId: string, appSystem: string, consumerId: string) => {
  return [];
};

export const startProcess = (companyId: string, appSystem: string, prepearedFiles: string[]) => {
  const newProcess: IProcess = {
    id: uidv1(),
    dateBegin: new Date(),
    companyId,
    appSystem,
    status: 'STARTED',
    prepearedFiles,
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

// export const processCleanup = (processId: string) => {
//   const process = processList.find((p) => p.id === processId);

//   const pf = [...process!.preparedFiles];

//   // перемещение файлов
//   for (; process!.preparedFiles.length; ) {
//     const fn = process!.preparedFiles.shift();
//     renameSync('/prepared/' + fn, '/messages/' + fn);
//     saveProcessList();
//   }
// };
