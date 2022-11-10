import path from 'path';

import { access, writeFile, readFile } from 'fs/promises';

import { constants } from 'fs';

import { IPathParams, IFileNoticeInfo } from '@lib/types';

import { IErrorNotice } from '@lib/store';

import config from '../../config';

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

export const getPathSystem = ({ companyId, appSystemId }: IPathParams) =>
  `DB_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

export const getPathNotice = (params: IPathParams, fn = '') => getPath([getPathSystem(params), 'deviceLogs'], fn);

export const params2noticeFileName = ({ producerId, deviceId }: IFileNoticeInfo) =>
  `from_${producerId}_dev_${deviceId}.json`;

export const notice2FullFileName = (params: IPathParams, fileInfo: IFileNoticeInfo): string => {
  const filePath = getPathNotice(params);
  return path.join(filePath, params2noticeFileName(fileInfo));
};

export let noticeList: IErrorNotice[];

/**
 * Inserts an object into the file.
 */
export const insertNotice = async (
  obj: IErrorNotice[],
  params: IPathParams,
  fileInfo: IFileNoticeInfo,
): Promise<void> => {
  try {
    const fileName = notice2FullFileName(params, fileInfo);
    const check = await checkFileExists(fileName);
    if (check) {
      const list = await readFile(fileName);
      noticeList = JSON.parse(list.toString());
    } else {
      noticeList = [];
    }

    const delta = noticeList.length + obj.length - config.DEVICE_LOG_MAX_LINES;

    if (delta > 0) noticeList.splice(0, delta);

    return writeFile(fileName, JSON.stringify([...noticeList, ...obj], undefined, 2), { encoding: 'utf8' });
  } catch (err) {
    throw new Error(`Ошибка записи данных в файл - ${err}`);
  }
};
