import path from 'path';
import { readdir, unlink, stat, writeFile } from 'fs/promises';

import { IFileSystem, IExtraFileInfo } from '@lib/types';

import { BYTES_PER_KB } from '../utils/constants';

import log from '../utils/logger';

import {
  fullFileName2alias,
  getAppSystemId,
  alias2fullFileName,
  readJsonFile,
  checkFileExists,
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
    return undefined;
  }

  const reMessage = arr[3].includes('_to_') ? /_from_(.+)_to_(.+)_dev_(.+)\.json/gi : /from_(.+)_dev_(.+)\.json/gi;
  const matchMessage = reMessage.exec(arr[3]);
  if (!matchMessage) {
    log.error(`Invalid file name ${arr[3]}`);
    return undefined;
  }

  const producerId = matchMessage[1];
  const producerName = users.findById(matchMessage[1])?.name;

  if (!producerName) {
    log.error('Контакт-отправитель не найден');
    return undefined;
  }

  const consumerId = arr[3].includes('_to_') ? matchMessage[2] : undefined;
  const consumerName = consumerId ? users.findById(consumerId)?.name : undefined;

  /* matchFileName[3] - uid устройства */

  const deviceUid = arr[3].includes('_to_') ? matchMessage[3] : matchMessage[2];

  const device = devices.data.find((el: any) => el.uid === deviceUid);

  if (!device) {
    log.error(`Устройство ${deviceUid}  не найдено`);
    return undefined;
  }

  const deviceId = device?.id;
  const deviceName = device?.name;

  return {
    company: { id: companyId, name: companyName },
    appSystem: { id: appSystemId, name: appSystemName },
    producer: { id: producerId, name: producerName },
    consumer: consumerId && consumerName ? { id: consumerId, name: consumerName } : undefined,
    device: { id: deviceId, name: deviceName },
  };
};

const splitFilePath = async (root: string): Promise<IFileSystem | undefined> => {
  const re = /[^\\|/]+$/gi;
  const match = re.exec(root);
  if (!match) {
    log.error(`Invalid filename ${root}`);
    return undefined;
  }
  const name = match[0];

  const nameWithoutExt = name.split('.')[0];
  const subPath = root.split(name)[0];
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

export const readListFiles = async (): Promise<IFileSystem[]> => {
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
  return files;
};

export const getFile = async (fid: string): Promise<any> => {
  const fullName = alias2fullFileName(fid);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${fid} в запросе`);
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

  const check = await checkFileExists(fullName);
  if (!check) {
    log.error(`Файл ${fullName} не существует`);
    return;
  }
  return unlink(fullName);
};

export const updateById = async <T>(id: string, fileData: Partial<Awaited<T>>): Promise<void> => {
  const fullName = alias2fullFileName(id);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${id} в запросе`);
    return;
  }

  try {
    return writeFile(fullName, JSON.stringify(fileData, undefined, 2), { encoding: 'utf8' });
  } catch (err) {
    log.error(`Ошибка редактирования файла ${fullName}  - ${err}`);
  }
};
