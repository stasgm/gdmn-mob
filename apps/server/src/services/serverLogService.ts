/* eslint-disable no-await-in-loop */

import { IFileActionResult, IFileParams, ISystemFile } from '@lib/types';

import { checkFileExists } from '../utils';

import {
  deleteFileById,
  deleteFiles,
  getFilesByParams,
  readDirectory,
  readFileData,
  serverLogParams,
  serverLogPath,
} from './fileUtils';

/**
 * Возвращает множество файлов логов сервера
 * @returns Массив объектов файлов ошибок
 */
const findMany = async (requestParams: Record<string, string>): Promise<ISystemFile[]> => {
  if (!(await checkFileExists(serverLogPath))) {
    throw new Error(`${serverLogPath} не существует или не доступна для чтения.`);
  }

  const fileNameList = await readDirectory(serverLogPath, false);

  return await getFilesByParams<ISystemFile>(fileNameList, serverLogParams, requestParams);
};

/**
 * Возвращает содержание файла ошибок сервера по ИД
 * @param id ИД сформированный из названия файла
 * @returns содержание найденного файла
 **/
const getContent = async (file: IFileParams, { start, end }: Record<string, number>): Promise<string> => {
  return await readFileData<string>(file, start, end);
};

/**
 * Удаляет  файла по ИД
 * @param id ИД файла
 **/
const deleteOne = async (file: IFileParams): Promise<void> => {
  return await deleteFileById(file);
};

/**
 * Удаляет множество файлов по массиву ИД
 * @param id ИД файла
 **/
const deleteMany = async (files: IFileParams[]): Promise<IFileActionResult[]> => {
  return await deleteFiles(files);
};

export { findMany, getContent, deleteOne, deleteMany };
