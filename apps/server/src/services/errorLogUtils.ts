import path from 'path';
import { access, writeFile, readFile, readdir, stat } from 'fs/promises';
import { constants, statSync } from 'fs';

import { IPathParams, IFileDeviceLogInfo, IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { generateId } from '../utils/helpers';

import config from '../../config';

import log from '../utils/logger';

import { BYTES_PER_KB } from '../utils/constants';

import { getDb } from './dao/db';

export const checkFileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

export const getPath = (folders: string[], fn = '') => {
  const folderPath = path.join(getDb().dbPath, ...folders);
  checkFileExists(folderPath);
  return path.join(folderPath, fn);
};

export const getPathSystem = ({ companyId, appSystemId }: IPathParams) =>
  `DB_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

export const getPathDeviceLog = (params: IPathParams, fn = '') => getPath([getPathSystem(params), 'deviceLogs'], fn);

export const getParamsDeviceLogFileName = ({ producerId, deviceId }: IFileDeviceLogInfo) =>
  `from_${producerId}_dev_${deviceId}.json`;

export const getDeviceLogFullFileName = (params: IPathParams, fileInfo: IFileDeviceLogInfo): string => {
  const filePath = getPathDeviceLog(params);
  return path.join(filePath, getParamsDeviceLogFileName(fileInfo));
};

const readJsonFile = async (fileName: string): Promise<IDeviceLog[] | string> => {
  const check = await checkFileExists(fileName);
  try {
    return check ? JSON.parse((await readFile(fileName)).toString()) : [];
  } catch (err) {
    return `Ошибка записи журнала ошибок устройства - ${err} в файл ${fileName}`;
  }
};

/**
 * Inserts an object into the file.
 */
export const saveDeviceLogFile = async (
  newDeviceLog: IDeviceLog[],
  pathParams: IPathParams,
  fileInfo: IFileDeviceLogInfo,
): Promise<void> => {
  try {
    const fileName = getDeviceLogFullFileName(pathParams, fileInfo);
    const oldDeviceLog: IDeviceLog[] | string = await readJsonFile(fileName);
    if (typeof oldDeviceLog === 'string') {
      log.error(oldDeviceLog);
      return;
    }

    const delta = oldDeviceLog.length + newDeviceLog.length - config.DEVICE_LOG_MAX_LINES;

    if (delta > 0) oldDeviceLog.splice(0, delta);

    return writeFile(fileName, JSON.stringify([...oldDeviceLog, ...newDeviceLog], undefined, 2), { encoding: 'utf8' });
  } catch (err) {
    log.error(`Ошибка записи журнала ошибок устройства с uid=${fileInfo.deviceId} в файл - ${err}`);
  }
};

const getListFiles = async (root: string): Promise<string[]> => {
  let newFiles: string[] = [];
  if (!(await checkFileExists(root))) {
    log.error(`Robust-protocol.errorFile: Ошибка чтения файла - ${root}`);
    return newFiles;
  }
  try {
    const files = await readdir(root, { withFileTypes: true });
    for (const d of files) {
      newFiles = [...newFiles, d.isFile() ? path.join(root, d.name) : ''];
    }
    return newFiles.filter((item) => item !== '');
  } catch (err) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории - ${err}`);
    return newFiles;
  }
};

const getListDirs = async (root: string): Promise<string[]> => {
  let newDirs: string[] = [];
  if (!(await checkFileExists(root))) {
    log.error(`Robust-protocol.errorFile: Ошибка чтения файла - ${root}`);
    return newDirs;
  }
  try {
    const dirs = await readdir(root, { withFileTypes: true });
    for (const d of dirs) {
      newDirs = [...newDirs, d.isDirectory() ? path.join(root, d.name) : ''];
    }
    return newDirs.filter((item) => item !== '');
  } catch (err) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории - ${err}`);
    return newDirs;
  }
};

const getAppSystemId = async (name: string): Promise<string> => {
  const { appSystems } = getDb();
  return appSystems.data.find((item) => item.name === name)?.id || '';
};

export const getDeviceLogsFolders = async (): Promise<string[]> => {
  const root = getDb().dbPath;
  const db = await getListDirs(root);
  let app: string[] = [];
  for (const item of db) {
    // eslint-disable-next-line no-await-in-loop
    app = [...app, ...(await getListDirs(item)).flat().map((i) => path.join(i, 'deviceLogs'))];
  }
  return app;
};

export const getDeviceLogsFiles = async (): Promise<string[]> => {
  const folders = await getDeviceLogsFolders();
  let files: string[] = [];
  for (const item of folders) {
    // eslint-disable-next-line no-await-in-loop
    const fileArr = await getListFiles(item);
    files = [...files, ...fileArr];
  }
  return files;
};

const fileInfoToObj = async (arr: string[]): Promise<IDeviceLogFiles | undefined> => {
  const { devices, companies, users } = getDb();
  const re = /from_(.+)_dev_(.+)\.json/gi;
  const match = re.exec(arr[3]);
  if (!match) {
    log.error(`Invalid deviceLogs file name ${arr[3]}`);
    return undefined;
  }

  const appSystemId = await getAppSystemId(arr[1]);
  const companyName = companies.findById(arr[0])?.name;

  if (!companyName) {
    log.error('Компания не найдена');
    return undefined;
  }

  const contactName = users.findById(match[1])?.name;

  if (!contactName) {
    log.error('Контакт не найден');
    return undefined;
  }

  const deviceName = devices.findById(match[2])?.name;

  if (!deviceName) {
    log.error(`Устройство ${match[2]} не найдено`);
    return undefined;
  }
  const pathParams: IPathParams = {
    companyId: arr[0],
    appSystemId: appSystemId,
  };

  const fileInfo: IFileDeviceLogInfo = {
    producerId: match[1],
    deviceId: match[2],
  };

  const fullFileName = getDeviceLogFullFileName(pathParams, fileInfo);

  const fileStat = statSync(fullFileName);
  const fileSize = (fileStat.size / BYTES_PER_KB).toString();
  const fileDate = fileStat.birthtime.toString();

  return {
    id: generateId(),
    company: { id: arr[0], name: companyName },
    appSystem: { id: appSystemId, name: arr[1] },
    contact: { id: match[1], name: contactName },
    device: { id: match[2], name: deviceName },
    path: fullFileName,
    date: fileDate,
    size: fileSize,
  };
};

export const getFilesObject = async (): Promise<IDeviceLogFiles[]> => {
  const filesFull = await getDeviceLogsFiles();
  let fileObjs: IDeviceLogFiles[] = [];
  for (const item of filesFull) {
    const re = /db_(.+)/gi;
    const match = re.exec(item);
    // eslint-disable-next-line no-await-in-loop
    const fileObj = await fileInfoToObj((match ? match[1] : item).split('\\'));
    if (fileObj) fileObjs = [...fileObjs, fileObj];
  }
  return fileObjs;
};
