import path from 'path';
import { readdir, unlink, stat } from 'fs/promises';

import { IFileSystem, IExtraFileInfo, INamedEntity } from '@lib/types';

import { BYTES_PER_KB } from '../utils/constants';

import log from '../utils/logger';

import { extraPredicate, getListPart } from '../utils/helpers';

import {
  fullFileName2alias,
  getAppSystemId,
  alias2fullFileName,
  readJsonFile,
  checkFileExists,
  writeIterableToFile,
} from '../utils/fileHelper';

import { getDb } from './dao/db';

export const _readDir = async (root: string): Promise<string[]> => {
  try {
    const subDirs = await readdir(root);
    const files = await Promise.all(
      subDirs.map(async (subDir) => {
        const res = path.join(root, subDir);
        return (await stat(res)).isDirectory() ? _readDir(res) : res;
      }),
    );
    return files.flat();
  } catch (err) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории - ${err}`);
    return [];
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

  const companyId = arr[1];
  const companyName = companies.findById(arr[0])?.name;

  if (!companyName) {
    log.error('Компания не найдена');
  }

  const getRx = (str: string): RegExp => {
    if (str.includes('_to_')) return /_from_(.+)_to_(.+)_dev_(.+)\.json/gi;
    return /from_(.+)_dev_(.+)\.json/gi;
  };

  //const reMessage = arr[3].includes('_to_') ?
  //  /_from_(.+)_to_(.+)_dev_(.+)\.json/gi
  //: /from_(.+)_dev_(.+)\.json/gi;

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

  const deviceId = device?.id;
  const deviceName = device?.name;

  return {
    company: companyId && companyName ? { id: companyId, name: companyName } : undefined,
    appSystem: appSystemName && appSystemName ? { id: appSystemId, name: appSystemName } : undefined,
    producer: producerName ? { id: producerId, name: producerName } : undefined,
    consumer: consumerId && consumerName ? { id: consumerId, name: consumerName } : undefined,
    device: deviceId && deviceName ? { id: deviceId, name: deviceName } : undefined,
  };
};

const splitFilePath = async (root: string): Promise<IFileSystem | undefined> => {
  /* const pathArr = root.split(path.sep);
  const name = pathArr.pop();*/
  const name = path.basename(root);
  const ext = path.extname(root);
  if (!name) {
    log.error(`Invalid filename ${root}`);
    return undefined;
  }
  const nameWithoutExt = path.basename(root, ext);
  const subPath = path.dirname(root);
  const fileStat = await stat(root);
  const fileSize = fileStat.size / BYTES_PER_KB;
  const fileDate = fileStat.birthtime.toString();

  const alias = fullFileName2alias(root);

  const fileInfo = await splitFileMessage(root);
  if (fileInfo) {
    return {
      id: alias ?? nameWithoutExt,
      date: fileDate,
      size: fileSize,
      fileName: name,
      path: subPath,
      company: fileInfo.company,
      appSystem: fileInfo.appSystem,
      producer: fileInfo.producer,
      consumer: fileInfo.consumer,
      device: fileInfo.device,
    };
  }

  return {
    id: alias ?? nameWithoutExt,
    date: fileDate,
    size: fileSize,
    fileName: name,
    path: subPath,
  };
};

export const getFoundEntity = (
  paramName: string,
  newParams: Record<string, string | number>,
  item: IFileSystem,
): boolean => {
  let paramFound = true;
  if (paramName in newParams) {
    paramFound = false;
    if (item[paramName] && Object.keys(item).indexOf(paramName) > 0) {
      const prop = (item[paramName] as INamedEntity).name.toUpperCase();
      paramFound = prop.includes((newParams[paramName] as string).toUpperCase());
      delete newParams[paramName];
    }
  }
  return paramFound;
};

export const getFoundString = (
  paramName: string,
  newParams: Record<string, string | number>,
  item: IFileSystem,
): boolean => {
  let paramFound = true;
  if (paramName in newParams) {
    paramFound = false;
    if (item[paramName] && Object.keys(item).indexOf(paramName) > 0) {
      const prop = (item[paramName] as string).toUpperCase();
      paramFound = prop.includes((newParams[paramName] as string).toUpperCase());
      delete newParams[paramName];
    }
  }
  return paramFound;
};

export const readListFiles = async (params: Record<string, string | number>): Promise<IFileSystem[]> => {
  const root = getDb().dbPath;
  let files: IFileSystem[] = [];
  const fileStrings = await _readDir(root);
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
        const fileName = item.fileName.toUpperCase();

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
  return getListPart(files, params);
};

export const getFile = async (fid: string): Promise<any> => {
  const fullName = alias2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${fid} в запросе`);
    return undefined;
  }

  const fileExt = path.extname(fullName);

  if (!fileExt || fileExt.toLowerCase() !== '.json') {
    log.error(`Файл некорректного формата '${fid} в запросе`);
    return undefined;
  }
  const fileJson: any | string = await readJsonFile(fullName);
  if (typeof fileJson === 'string') {
    log.error(fileJson);
    return undefined;
  }
  return fileJson;
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

export const updateById = async <T>(id: string, fileData: Partial<Awaited<T>>): Promise<void> => {
  const fullName = alias2fullFileName(id);
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
