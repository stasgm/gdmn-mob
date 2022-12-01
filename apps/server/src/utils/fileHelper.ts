import path from 'path';
import { access, readFile } from 'fs/promises';
import { constants } from 'fs';

import { IPathParams } from '@lib/types';

import log from '../utils/logger';

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
  `DB_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

export const fullFileName2alias = (fullFileName: string): string | undefined => {
  const re = /db_(.+)/gi;
  const match = re.exec(fullFileName);
  const fileNameArr = fullFileName.split(getDb().dbPath);
  if (fileNameArr.length !== 2) return undefined;
  const shortName = (match ? `db_${match[1]}` : fileNameArr[1]).split('/').join('\\').split('\\');
  return shortName.reduce((str, prev, i, arr) => {
    const nameWithoutExt = prev.split('.')[0];
    const temp = i === arr.length - 1 ? nameWithoutExt : prev;
    str += i === 0 ? temp : `_D_${temp}`;
    return str;
  }, '');
};

export const alias2fullFileName = (alias: string): string | undefined => {
  const match = alias.split('_D_').join('\\') + '.json';
  return getPath([match]);
};

export const readJsonFile = async <T>(fileName: string): Promise<T | string> => {
  const check = await checkFileExists(fileName);
  try {
    return check ? JSON.parse((await readFile(fileName, 'utf-8')).toString()) : `Ошибка чтения файла ${fileName} `;
  } catch (err) {
    return `Ошибка чтения файла ${fileName} - ${err} `;
  }
};

export const getAppSystemId = async (name: string): Promise<string> => {
  const { appSystems } = getDb();
  return appSystems.data.find((item) => item.name === name)?.id || '';
};
