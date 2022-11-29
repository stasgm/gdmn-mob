import path from 'path';
import { readdir, unlink, stat } from 'fs/promises';
import { constants, statSync } from 'fs';

import { IFileSystem, IExtraFileInfo } from '@lib/types';

import { BYTES_PER_KB } from '../utils/constants';

import log from '../utils/logger';

import { fullFileName2alias, getAppSystemId, alias2fullFileName, readJsonFile } from '../utils/fileHelper';

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

const splitFileMessage = async (path: string): Promise<IExtraFileInfo | undefined> => {
  const { devices, companies, users } = getDb();
  const isMessageFile = path.includes('from_') && path.includes('_dev_') && path.includes('json');
  if (!isMessageFile) return undefined;
  const re = /db_(.+)/gi;
  const match = re.exec(path);
  if (!match) return undefined;
  const arr = match[1].split('/').join('\\').split('\\');
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
    log.error(`Устройство ${matchMessage[3]} не найдено`);
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

const splitFilePath = async (path: string): Promise<IFileSystem | undefined> => {
  const re = /[^(\\|/)]+$/gi;
  const match = re.exec(path);
  if (!match) {
    log.error(`Invalid filename ${path}`);
    return undefined;
  }
  const name = match[0];
  const nameWithoutExt = name.split('.')[0];
  const subPath = path.split(match[0])[0];
  const fileStat = statSync(path);
  const fileSize = fileStat.size / BYTES_PER_KB;
  const fileDate = fileStat.birthtime.toString();

  const alias = fullFileName2alias(path);
  console.log('alias=', alias);

  const fileInfo = await splitFileMessage(path);
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
