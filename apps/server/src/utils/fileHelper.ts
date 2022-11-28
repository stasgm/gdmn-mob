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
  if (!match) return undefined;
  const shortName = (match ? match[1] : fullFileName).split('/').join('\\').split('\\');
  if (shortName.length !== 4) return undefined;
  const nameWithoutExt = shortName[3].split('.')[0];
  return `db_${shortName[0]}_app_${shortName[1]}_dir_${shortName[2]}_name_${nameWithoutExt}`;
};

export const alias2fullFileName = (alias: string): string | undefined => {
  const re = /db_(.+)_app_(.+)_dir_(.+)_name_(.+)/gi;
  const match = re.exec(alias);
  if (!match) {
    log.error(`Invalid deviceLogs file alias ${alias}`);
    return undefined;
  }

  return getPath([`db_${match[1]}\\${match[2]}\\${match[3]}\\${match[4]}.json`]);
};

export const readJsonFile = async <T>(fileName: string): Promise<T | string> => {
  const check = await checkFileExists(fileName);
  try {
    return check ? JSON.parse((await readFile(fileName)).toString()) : [];
  } catch (err) {
    return `Ошибка записи журнала ошибок устройства - ${err} в файл ${fileName}`;
  }
};

export const getAppSystemId = async (name: string): Promise<string> => {
  const { appSystems } = getDb();
  return appSystems.data.find((item) => item.name === name)?.id || '';
};
