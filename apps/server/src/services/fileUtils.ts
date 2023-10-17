import path from 'path';
import { readdir, unlink, stat, rename } from 'fs/promises';

import { IFileSystem, IExtraFileInfo, IPathParams, IDBCompany, IFileObject } from '@lib/types';

import { BYTES_PER_KB, MSEС_IN_DAY, collectionNames } from '../utils/constants';

import log from '../utils/logger';

import config from '../../config';

import { getListPart } from '../utils/helpers';

import {
  getAppSystemId,
  readJsonFile,
  writeIterableToFile,
  getFoundEntity,
  getFoundString,
  getPathSystem,
  idObj2fullFileName,
} from '../utils/fileHelper';

import { checkDeviceLogsFiles } from './errorLogUtils';

import { getDb } from './dao/db';

export const _readDir = async (root: string, excludeFolders: string[] | undefined): Promise<string[]> => {
  try {
    const dirs = await readdir(root);
    const exclude: string[] = (excludeFolders ?? []).map((i) => i.toLocaleLowerCase());
    const subDirs = dirs.filter((item) => !exclude.includes(item.toLocaleLowerCase()));

    const files = await Promise.all(
      subDirs.map(async (subDir) => {
        const res = path.join(root, subDir);
        return (await stat(res)).isDirectory() ? _readDir(res, excludeFolders) : res;
      }),
    );
    return files.flat();
  } catch (err) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории - ${err}`);
    return [];
  }
};

export const checkFiles = async (): Promise<void> => {
  const defaultExclude = Object.values(collectionNames).map((i) => `${i}.json`);

  const root = getDb().dbPath;
  const files = await _readDir(root, [...defaultExclude, 'deviceLogs']);

  for (const file of files) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const fileStat = await stat(file);
      const fileDate = fileStat.birthtimeMs;
      const period =
        file.toUpperCase().indexOf('DOCS') === -1 || file.toUpperCase().indexOf('MESSAGES') > 0
          ? config.FILES_SAVING_PERIOD_IN_DAYS
          : config.DOCS_SAVING_PERIOD_IN_DAYS;
      if ((new Date().getTime() - fileDate) / MSEС_IN_DAY > period) {
        // eslint-disable-next-line no-await-in-loop
        await unlink(file);
      }
    } catch (err) {
      log.warn(`Ошибка при удалении старого файла-- ${err}`);
    }
  }

  try {
    await checkDeviceLogsFiles();
  } catch (err) {
    log.warn(`Ошибка при удалении старого файла логов-- ${err}`);
  }
};

const splitFileMessage = async (root: string): Promise<IExtraFileInfo | undefined> => {
  const { devices, companies, users } = getDb();
  const isMessageFile = root.includes('from_') && root.includes('_dev_') && root.includes('json');
  if (!isMessageFile) return undefined;
  const re = /db_(.+)/gi;
  const match = re.exec(root);
  if (!match) return undefined;
  const arr = match[1].split(path.sep);
  if (arr.length !== 4) return undefined;

  const appSystemId = await getAppSystemId(arr[1]);
  const appSystemName = arr[1];

  const companyId = arr[0];
  const companyName = companies.findById(arr[0])?.name;

  if (!companyName) {
    log.error('Компания не найдена');
  }

  const folderName = arr[2];

  const getRx = (str: string): RegExp => {
    const isNewFormat = str.includes('__');
    const isMess = str.includes('_to_');
    if (!isMess) return /from_(.+)_dev_(.+)\.json/gi;
    if (isNewFormat) return /_from_(.+)_to_(.+)_dev_(.+)__(.+)\.json/gi;
    return /_from_(.+)_to_(.+)_dev_(.+)\.json/gi;
  };

  const reMessage = getRx(arr[3]);
  const matchMessage = reMessage.exec(arr[3]);
  if (!matchMessage) {
    log.error(`Invalid file name ${arr[3]}`);
    return {
      company: companyId && companyName ? { id: companyId, name: companyName } : undefined,
      appSystem: appSystemName && appSystemName ? { id: appSystemId, name: appSystemName } : undefined,
    };
  }

  const producerId = matchMessage[1];
  const producerName = users.findById(matchMessage[1])?.name;

  if (!producerName) {
    log.error('Контакт-отправитель не найден');
  }

  const consumerId = arr[3].includes('_to_') ? matchMessage[2] : undefined;
  const consumerName = consumerId ? users.findById(consumerId)?.name : undefined;

  /* matchFileName[3] - uid устройства */

  const deviceUid = arr[3].includes('_to_') ? matchMessage[3] : matchMessage[2];

  const device = devices.data.find((el: any) => el.uid === deviceUid);

  /*if (!device) {
    log.error(`Устройство ${deviceUid}  не найдено`);
  }*/

  const deviceName = device?.name;

  return {
    company: companyId && companyName ? { id: companyId, name: companyName } : undefined,
    appSystem: appSystemName && appSystemName ? { id: appSystemId, name: appSystemName } : undefined,
    producer: producerName ? { id: producerId, name: producerName } : undefined,
    consumer: consumerId && consumerName ? { id: consumerId, name: consumerName } : undefined,
    device: deviceUid && deviceName ? { id: deviceUid, name: deviceName } : undefined,
    folderName: folderName,
  };
};

const splitFilePath = async (root: string): Promise<IFileSystem | undefined> => {
  const name = path.basename(root);
  const ext = path.extname(root);
  if (!name) {
    log.error(`Invalid filename ${root}`);
    return;
  }
  const nameWithoutExt = path.basename(root, ext);
  const subPath = path.dirname(root);
  try {
    const fileStat = await stat(root);
    const fileSize = fileStat.size / BYTES_PER_KB;
    const fileDate = fileStat.birthtime.toString();
    const fileModifiedDate = fileStat.mtime.toString();

    //const alias = fullFileName2alias(root);

    const fileInfo = await splitFileMessage(root);
    if (fileInfo) {
      return {
        id: nameWithoutExt,
        date: fileDate,
        size: fileSize,
        path: subPath,
        ext: ext.slice(1),
        folderName: fileInfo.folderName,
        company: fileInfo.company,
        appSystem: fileInfo.appSystem,
        producer: fileInfo.producer,
        consumer: fileInfo.consumer,
        device: fileInfo.device,
        mdate: fileModifiedDate,
      };
    }

    return {
      id: nameWithoutExt,
      date: fileDate,
      size: fileSize,
      path: subPath,
      ext: ext,
      mdate: fileModifiedDate,
    };
  } catch (err) {
    log.error(`Invalid filename ${root}: ${err}`);
    return;
  }
};

export const getCompanyIdByName = (name: string): IDBCompany | undefined => {
  const { companies } = getDb();
  return companies.data.find((item) => item.name.toUpperCase() === name.toUpperCase());
};

export const readListFiles = async (params: Record<string, string | number>): Promise<IFileSystem[]> => {
  const root = getDb().dbPath;

  const fullRoot =
    'company' in params && 'appSystem' in params
      ? path.join(root, `db_${getCompanyIdByName(params['company'] as string)?.id}`, params['appSystem'] as string)
      : root;

  let files: IFileSystem[] = [];
  const fileStrings = await _readDir(fullRoot, undefined);
  for (const file of fileStrings) {
    // eslint-disable-next-line no-await-in-loop
    const fileObj = await splitFilePath(file);
    if (fileObj) {
      files = [...files, fileObj];
    }
  }
  files = files.filter((item: IFileSystem) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    const companyFound = getFoundEntity('company', newParams, item);
    const appSystemFound = getFoundEntity('appSystem', newParams, item);
    const consumerFound = getFoundEntity('consumer', newParams, item);
    const producerFound = getFoundEntity('producer', newParams, item);
    const deviceFound = getFoundEntity('device', newParams, item);
    const pathFound = getFoundString('path', newParams, item);
    const fileNameFound = getFoundString('fileName', newParams, item);

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
    let filteredFiles = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const fileName = item.id.toUpperCase();

        filteredFiles = fileName.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return (
      companyFound &&
      appSystemFound &&
      consumerFound &&
      producerFound &&
      deviceFound &&
      pathFound &&
      fileNameFound &&
      dateFound &&
      uidFound &&
      filteredFiles
    );
  });
  files = files.sort((a, b) => new Date(b.mdate).getTime() - new Date(a.mdate).getTime());
  return getListPart(files, params);
};

export const getFile = async (fid: IFileObject): Promise<any> => {
  const fullName = idObj2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID ${fid.id} в запросе`);
    return undefined;
  }

  const fileExt = path.extname(fullName);

  if (!fileExt || fileExt.toLowerCase() !== '.json') {
    log.error(`Файл некорректного формата ${fid.id} в запросе`);
    return undefined;
  }
  const fileJson: any | string = await readJsonFile(fullName);
  if (typeof fileJson === 'string') {
    log.error(fileJson);
    return undefined;
  }
  return fileJson;
};

export const deleteFileById = async (fid: IFileObject): Promise<void> => {
  const fullName = idObj2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID ${fid.id} в запросе`);
    return;
  }
  return await unlink(fullName);
};

export const deleteManyFiles = async (ids: IFileObject[]): Promise<void> => {
  await Promise.allSettled(
    ids.map(async (id) => {
      const fullName = idObj2fullFileName(id);
      return await unlink(fullName);
    }),
  );
};

export const updateById = async <T>(id: IFileObject, fileData: Partial<Awaited<T>>): Promise<void> => {
  const fullName = idObj2fullFileName(id);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${id} в запросе`);
    return;
  }

  const fileExt = path.extname(fullName);

  if (!fileExt || fileExt.toLowerCase() !== '.json') {
    log.error(`Файл с некорректного формата '${id} в запросе`);
    return undefined;
  }

  try {
    return writeIterableToFile(fullName, JSON.stringify(fileData, undefined, 2), {
      encoding: 'utf8',
      flag: 'a',
    });
  } catch (err) {
    log.error(`Ошибка редактирования файла ${fullName}  - ${err}`);
  }
};

export const getListFolders = async (appPathParams: IPathParams): Promise<string[]> => {
  const pathSystem = path.join(getDb().dbPath, getPathSystem(appPathParams));
  try {
    const files = await readdir(pathSystem);
    const folders = await Promise.all(
      files.map(async (curr: string) => {
        const res = path.join(pathSystem, curr);
        const folderName = res.split(path.sep).pop();
        return (await stat(res)).isDirectory() ? folderName : undefined;
      }),
    );

    return folders.filter((i) => !!i) as string[];
  } catch (err) {
    log.error(`Ошибка чтения директории ${pathSystem}  - ${err}`);
    return [];
  }
};

export const moveManyFiles = async (ids: IFileObject[], folderName: string): Promise<void> => {
  try {
    await Promise.allSettled(
      ids.map(async (idObj) => {
        const newId = { ...idObj, folder: folderName };
        const name = idObj2fullFileName(idObj);
        const newName = idObj2fullFileName(newId);
        return await rename(name, newName);
      }),
    );
  } catch (err) {
    log.error(`Ошибка перемещения файлов в директорию ${folderName}  - ${err}`);
  }
};
