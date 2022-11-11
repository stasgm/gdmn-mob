import path from 'path';
import { access, writeFile, readFile, readdir, stat } from 'fs/promises';
import { constants } from 'fs';

import { IPathParams, IFileDeviceLogInfo, IDeviceLog } from '@lib/types';

import config from '../../config';

import log from '../utils/logger';

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

/* const readDirRecursive = async (root: string, filter: string, files: string[], prefix: string) => {
  prefix = prefix || '';
  files = files || [];

  const dir = path.join(root, prefix);
  if (!checkFileExists(dir)) return files;
  const statInfo = await stat(dir);
  if (statInfo.isDirectory())
    readdir(dir)
    .filter(function (name, index) {
      return filter(name, index, dir)
    })
    .forEach(function (name) {
      read(root, filter, files, path.join(prefix, name))
    })
  else
    files.push(prefix)

  return files
}
 */
