import { readFileSync, writeFileSync, accessSync, constants } from 'fs';

import path from 'path';

import { IFiles, IProcess } from '@lib/types';
import { v1 as uidv1 } from 'uuid';

import config from '../../config';

export let processList: IProcess[];

const checkFileSync = (path: string) => {
  try {
    accessSync(path, constants.R_OK | constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const basePath = path.join(config.FILES_PATH, '/.DB');

const processPath = path.join(basePath, 'processes.json');
if (!checkFileSync(processPath)) writeFileSync(processPath, '[]');

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
