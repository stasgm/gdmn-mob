import path from 'path';
import { access, readFile } from 'fs/promises';
import { constants, createReadStream, createWriteStream } from 'fs';

import { once } from 'events';

import { finished } from 'stream';

import { promisify } from 'util';

import { IPathParams } from '@lib/types';

import { BYTES_PER_MB, defMaxFilesSize } from '../utils/constants';

import { getDb } from '../services/dao/db';

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
  return path.join(folderPath, fn);
};

export const getPathSystem = ({ companyId, appSystemId }: IPathParams) =>
  `db_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

export const fullFileName2alias = (fullFileName: string): string | undefined => {
  const re = /db_(.+)/gi;
  const match = re.exec(fullFileName);
  const fileNameArr = fullFileName.split(getDb().dbPath);
  if (fileNameArr.length !== 2) return undefined;
  const shortName = (match ? `db_${match[1]}` : fileNameArr[1]).split(path.sep);
  return shortName.reduce((str, prev, i) => {
    /*const nameWithoutExt = prev.split('.')[0];
    const temp = i === arr.length - 1 ? nameWithoutExt : prev;*/
    const temp = prev.replace('.', '_EXT_');
    str += i === 0 ? temp : `_D_${temp}`;
    return str;
  }, '');
};

export const alias2fullFileName = (alias: string): string => {
  const match = alias.split('_D_').join(path.sep).split('_EXT_').join('.');
  return getPath([match]);
};

const readableToString = async (readable: any): Promise<string | Error> => {
  const data = [];
  let size = 0;
  for await (const chunk of readable) {
    data.push(chunk);

    if (chunk.toString()[0] !== '{' && chunk.toString()[0] !== '[') throw new Error('Неправильный формат файла');

    size += new Blob([chunk.toString()]).size / BYTES_PER_MB;

    if (size > defMaxFilesSize) throw new Error('Слишком большой размер файла');
  }
  return data.join('');
};

export const readJsonFile = async <T>(fileName: string): Promise<T | string> => {
  const check = await checkFileExists(fileName);

  try {
    const streamRead = createReadStream(fileName, { encoding: 'utf8' });
    try {
      const result = await readableToString(streamRead);

      return check ? JSON.parse(result.toString()) : `Ошибка чтения файла ${fileName} `;
    } catch (err) {
      return `Ошибка чтения файла ${fileName} - ${err} `;
    }
    //(await readFile(fileName, 'utf-8')).toString()
  } catch (err) {
    return `Ошибка чтения файла ${fileName} - ${err} `;
  }
};

const finishedPromisify = promisify(finished);

export const writeIterableToFile = async (filename: string, iterable: string): Promise<void> => {
  const writable = createWriteStream(filename, { encoding: 'utf8' });
  for await (const chunk of iterable) {
    if (!writable.write(chunk)) {
      await once(writable, 'drain');
    }
  }
  writable.end();
  await finishedPromisify(writable);
};

export const getAppSystemId = async (name: string): Promise<string> => {
  const { appSystems } = getDb();
  return appSystems.data.find((item) => item.name === name)?.id || '';
};
