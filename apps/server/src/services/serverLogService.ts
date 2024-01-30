import path from 'path';

import { stat } from 'fs/promises';

import { IServerLogFile, IServerLogResponse } from '@lib/types';

import { checkFileExists, readTextFile } from '../utils/fileHelper';

import config from '../../config';

import log from '../utils/logger';

import { BYTES_PER_KB } from '../utils/constants';

import { getListFiles } from './errorLogUtils';

/**
 * Возвращает множество файлов логов сервера
 * @returns Массив объектов файлов ошибок
 */
const findMany = async (params: Record<string, string | number>): Promise<IServerLogFile[]> => {
  const logPath = path.join(process.cwd(), config.LOG_PATH);
  let files: string[] = [];
  try {
    if (await checkFileExists(logPath)) {
      const fileArr = await getListFiles(logPath);
      files = [...files, ...fileArr];
    }
    const filterText: string | undefined =
      'filterText' in params ? (params.filterText as string).toUpperCase() : undefined;

    files = files.filter((item: string) => {
      let filteredFiles = true;

      if (filterText) {
        const fileName = path.basename(item).toUpperCase();
        filteredFiles = fileName.includes(filterText);
      }

      return filteredFiles;
    });
    let fileObjs: IServerLogFile[] = [];
    for (const item of files) {
      // eslint-disable-next-line no-await-in-loop
      const fileObj = await fileInfoToObj(item);
      if (fileObj) fileObjs = [...fileObjs, fileObj];
    }

    return fileObjs;
  } catch (err) {
    log.error(`Robust-protocol.errorDirectory: Ошибка чтения директории логов сервера - ${err}`);
    return [];
  }
};

//**
//  * Возвращает содержание файла ошибок сервера по ИД
//  * @param fid ИД сформированный из названия файла
//  * @returns содержание найденного файла
//  */
const findOne = async (
  fid: string,
  start: number | undefined,
  end: number | undefined,
): Promise<IServerLogResponse | undefined> => {
  const fileName = fid.split('_EXT_').join('.').split('_D_').join(path.sep);
  const logPath = path.join(process.cwd(), config.LOG_PATH);
  const fullName = path.join(logPath, fileName);
  if (!fullName) {
    log.error(`Неправильный параметр ID '${fid} в запросе`);
    return undefined;
  }
  try {
    const fileText: string = await readTextFile(fullName, start, end);
    const fileStat = await stat(fullName);
    const isEndOfFile: boolean = end === undefined ? true : fileStat.size <= end;
    return {
      isFinished: isEndOfFile,
      textFile: fileText,
    };
  } catch (err) {
    log.warn(`Невозможно прочитать файл '${fileName} `);
    return undefined;
  }
};

const fileInfoToObj = async (fullFileName: string): Promise<IServerLogFile | undefined> => {
  try {
    const fileName = path.basename(fullFileName);
    const filePath = path.dirname(fullFileName);
    const fileStat = await stat(fullFileName);
    const fileSize = fileStat.size / BYTES_PER_KB;
    const fileDate = fileStat.birthtime.toString();
    const fileModifiedDate = fileStat.mtime.toString();
    const alias = fileName.split(path.sep).join('_D_').split('.').join('_EXT_');

    return {
      id: alias,
      date: fileDate,
      size: fileSize,
      mdate: fileModifiedDate,
      fileName: fileName,
      path: filePath,
    };
  } catch (err) {
    log.error(`Ошибка чтения статистики файла-- ${err}`);
    return undefined;
  }
};

export { findMany, findOne };
