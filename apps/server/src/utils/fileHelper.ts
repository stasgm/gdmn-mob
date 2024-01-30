import path from 'path';
import { access } from 'fs/promises';
import { constants, createReadStream, createWriteStream } from 'fs';

import { once } from 'events';

import { finished } from 'stream';

import { promisify } from 'util';

import { IPathParams, IFileSystem, INamedEntity, IDeviceLogFiles } from '@lib/types';

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
  return shortName.reduce((str, prev, i, arr) => {
    const temp = i === arr.length - 1 ? prev.replace('.', '_EXT_') : prev;
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
  let start = 0;
  for await (const chunk of readable) {
    const chunkString = chunk.toString();
    data.push(chunk);

    if (chunkString[0] !== '{' && chunkString[0] !== '[' && start === 0) {
      throw new Error('Неправильный формат файла');
    }
    start++;

    size += Buffer.byteLength(chunk.toString()) / BYTES_PER_MB;

    if (size > defMaxFilesSize) throw new Error('Слишком большой размер файла');
  }
  return data.join('');
};

// export const readJsonFile = async <T>(fileName: string): Promise<T | string> => {
//   const check = await checkFileExists(fileName);

//   try {
//     const streamRead = createReadStream(fileName, { encoding: 'utf8' });
//     try {
//       const result = await readableToString(streamRead);

//       return check ? JSON.parse(result.toString()) : `Ошибка чтения файла ${fileName} `;
//     } catch (err) {
//       return `Ошибка чтения файла ${fileName} - ${err} `;
//     }
//     //(await readFile(fileName, 'utf-8')).toString()
//   } catch (err) {
//     return `Ошибка чтения файла ${fileName} - ${err} `;
//   }
// };

export const readJsonFile = async <T>(fileName: string): Promise<T | string> => {
  try {
    const streamRead = createReadStream(fileName, { encoding: 'utf8' });
    const result = await readableToString(streamRead);
    return JSON.parse(result.toString());
  } catch (err) {
    return `Ошибка чтения файла ${fileName} - ${err} `;
  }
};

export const readTextFile = async <T>(
  fileName: string,
  start: number | undefined,
  end: number | undefined,
): Promise<T | string> => {
  try {
    const streamRead = createReadStream(fileName, { encoding: 'utf8', start: start, end: end });
    const data = [];
    for await (const chunk of streamRead) {
      data.push(chunk);
    }
    return data.join('').toString();
  } catch (err) {
    return `Ошибка чтения файла ${fileName} - ${err} `;
  }
};

const finishedPromisify = promisify(finished);

export const writeIterableToFile = async (filename: string, iterable: string, options?: any): Promise<void> => {
  const writable = createWriteStream(filename, options);
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

export const getFoundEntity = (
  paramName: string,
  newParams: Record<string, string | number>,
  item: IFileSystem | IDeviceLogFiles,
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
  item: IFileSystem | IDeviceLogFiles,
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
