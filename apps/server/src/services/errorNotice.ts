import path from 'path';

import { access, appendFile } from 'fs/promises';

import { constants } from 'fs';

import { IMessageParams, IFileNoticeInfo } from '@lib/types';

import { IErrorNotice } from '@lib/store';

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

export const getPathSystem = ({ companyId, appSystemId }: IMessageParams) =>
  `DB_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

export const getPathNotice = (params: IMessageParams, fn = '') => getPath([getPathSystem(params), 'mobileLogs'], fn);

export const params2noticeFileName = ({ producerId, deviceId }: IFileNoticeInfo) =>
  `from_${producerId}_dev_${deviceId}.json`;

export const notice2FullFileName = (params: IMessageParams, fileInfo: IFileNoticeInfo): string => {
  const filePath = getPathNotice(params);
  return path.join(filePath, params2noticeFileName(fileInfo));
};

/**
 * Inserts an object into the file.
 */

export const insertNotice = (obj: IErrorNotice, params: IMessageParams, fileInfo: IFileNoticeInfo): Promise<void> => {
  try {
    const fileName = notice2FullFileName(params, fileInfo);
    return appendFile(fileName, JSON.stringify(obj), { encoding: 'utf8' });
  } catch (err) {
    throw new Error(`Ошибка записи данных в файл - ${err}`);
  }
};
