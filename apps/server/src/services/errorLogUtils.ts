import path from 'path';
import { readdir, unlink, stat } from 'fs/promises';

import { IPathParams, IFileDeviceLogInfo, IDeviceLog, IDeviceLogFiles, IDeviceLogOptions } from '@lib/types';

import {
  checkFileExists,
  getPath,
  getPathSystem,
  fullFileName2alias,
  alias2fullFileName,
  readJsonFile,
  getAppSystemId,
  writeIterableToFile,
  getFoundEntity,
  getFoundString,
} from '../utils/fileHelper';

import config from '../../config';

import log from '../utils/logger';

import { getListPart } from '../utils/helpers';

import { BYTES_PER_KB, MSEС_IN_DAY } from '../utils/constants';

import { getDb } from './dao/db';

export const getPathDeviceLog = (params: IPathParams, fn = '') => getPath([getPathSystem(params), 'deviceLogs'], fn);

export const getParamsDeviceLogFileName = ({ producerId, deviceId }: IFileDeviceLogInfo) =>
  `from_${producerId}_dev_${deviceId}.json`;

export const getDeviceLogFullFileName = (params: IPathParams, fileInfo: IFileDeviceLogInfo): string => {
  const filePath = getPathDeviceLog(params);
  return path.join(filePath, getParamsDeviceLogFileName(fileInfo));
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
    const check = await checkFileExists(fileName);

    const oldDeviceLog: IDeviceLog[] | string = check ? await readJsonFile(fileName) : [];
    if (typeof oldDeviceLog === 'string') {
      log.error(oldDeviceLog);
      return;
    }

    const delta = oldDeviceLog.length + newDeviceLog.length - config.DEVICE_LOG_MAX_LINES;

    if (delta > 0) oldDeviceLog.splice(0, delta);

    return writeIterableToFile(fileName, JSON.stringify([...oldDeviceLog, ...newDeviceLog], undefined, 2), {
      encoding: 'utf8',
      flag: 'a',
    });
  } catch (err) {
    log.error(`Ошибка записи журнала ошибок устройства с uid=${fileInfo.deviceId} в файл - ${err}`);
  }
};

export const getListFiles = async (root: string): Promise<string[]> => {
  let newFiles: string[] = [];
  if (!(await checkFileExists(root))) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории - ${root}`);
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
    log.error(`errorDirectory: Ошибка чтения директории - ${root}`);
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
    if (await checkFileExists(item)) {
      // eslint-disable-next-line no-await-in-loop
      const fileArr = await getListFiles(item);
      files = [...files, ...fileArr];
    }
  }
  return files;
};

export const checkDeviceLogsFiles = async (): Promise<void> => {
  const { devices } = getDb();
  const files = await getDeviceLogsFiles();
  for (const file of files) {
    try {
      const re = /from_(.+)_dev_(.+)\.json/gi;
      const match = re.exec(file);
      if (!match) {
        log.error(`Invalid deviceLogs file name ${file}`);
        unlink(file);
      } else {
        const device = devices.data.find((el: any) => el.uid === match[2]);

        if (!device) {
          // eslint-disable-next-line no-await-in-loop
          const fileStat = await stat(file);
          const fileDate = fileStat.birthtimeMs;
          if ((new Date().getTime() - fileDate) / MSEС_IN_DAY > config.FILES_SAVING_PERIOD_IN_DAYS) {
            unlink(file);
          }
        }
      }
    } catch (err) {
      log.warn(`Ошибка при удалении старого файла логов-- ${err}`);
    }
  }
};

const fileInfoToObj = async (arr: string[]): Promise<IDeviceLogFiles | undefined> => {
  const { devices, companies, users } = getDb();
  if (arr.length !== 4) {
    log.error('Invalid deviceLogs');
    return undefined;
  }
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

  /*  match[2] - uid устройства */

  const device = devices.data.find((el: any) => el.uid === match[2]);
  const deviceName = device?.name;

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
  try {
    const fileStat = await stat(fullFileName);
    const fileSize = fileStat.size / BYTES_PER_KB;
    const fileDate = fileStat.birthtime.toString();
    const fileModifiedDate = fileStat.mtime.toString();

    const alias = fullFileName2alias(fullFileName);
    if (!alias) {
      log.error(`Invalid deviceLogs file name ${fullFileName}`);
      return undefined;
    }
    return {
      id: alias,
      company: { id: arr[0], name: companyName },
      appSystem: { id: appSystemId, name: arr[1] },
      contact: { id: match[1], name: contactName },
      device: { id: match[2], name: deviceName },
      date: fileDate,
      size: fileSize,
      mdate: fileModifiedDate,
    };
  } catch (err) {
    log.error(`Ошибка чтения статистики файла-- ${err}`);
    return undefined;
  }
};

export const getFilesObject = async (params: Record<string, string | number>): Promise<IDeviceLogFiles[]> => {
  const filesFull = await getDeviceLogsFiles();
  let fileObjs: IDeviceLogFiles[] = [];
  for (const item of filesFull) {
    const re = /db_(.+)/gi;
    const match = re.exec(item);
    // eslint-disable-next-line no-await-in-loop
    const fileObj = await fileInfoToObj((match ? match[1] : item).split(path.sep));
    if (fileObj) fileObjs = [...fileObjs, fileObj];
  }

  fileObjs = fileObjs.filter((item: IDeviceLogFiles) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    const companyFound = getFoundEntity('company', newParams, item);
    const appSystemFound = getFoundEntity('appSystem', newParams, item);
    const contactFound = getFoundEntity('contact', newParams, item);
    const deviceFound = getFoundEntity('device', newParams, item);

    let dateFound = true;
    if ('date' in newParams) {
      dateFound = false;
      if (item.date) {
        const date = new Date(item.date || '').toLocaleString('ru', { hour12: false }).toUpperCase();
        dateFound = date.includes((newParams.date as string).toUpperCase());
        delete newParams['date'];
      }
    }

    let uidFound = true;
    if ('uid' in newParams) {
      uidFound = false;
      if (item.device) {
        const uid = item.device.id.toUpperCase();
        uidFound = uid.includes((newParams.uid as string).toUpperCase());
        delete newParams['uid'];
      }
    }

    /** filtering data */
    /* let filteredFiles = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const fileName = item.fileName.toUpperCase();

        filteredFiles = fileName.includes(filterText);
      }
      delete newParams['filterText'];
    }
 */
    return companyFound && appSystemFound && contactFound && deviceFound && dateFound && uidFound;
  });

  return getListPart(fileObjs, params);
};

export const getFile = async <IDeviceLog>(fid: string): Promise<IDeviceLog[]> => {
  const fullName = alias2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${fid} в запросе`);
    return [];
  }
  const deviceLog: IDeviceLog[] | string = await readJsonFile(fullName);
  if (typeof deviceLog === 'string') {
    log.error(deviceLog);
    return [];
  }
  return deviceLog;
};

export const deleteFileById = async (fid: string): Promise<void> => {
  const fullName = alias2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${fid} в запросе`);
    return;
  }
  return unlink(fullName);
};

export const deleteManyFiles = async (ids: string[]): Promise<void> => {
  await Promise.allSettled(
    ids.map(async (id) => {
      const fullName = alias2fullFileName(id);
      return unlink(fullName);
    }),
  );
};
