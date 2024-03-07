/* eslint-disable no-await-in-loop */
import path from 'path';

import { stat } from 'fs/promises';

import { IFileActionResult, IFileParams, ISystemFile, IServerLogResponse, IServerLogParams } from '@lib/types';

import { log, checkFileExists, isAllParamMatched, searchTextInFile, getListPartByParams } from '../utils';

import config from '../../config';

import { IParamsInfo } from '../types';

import { deleteFileById, deleteFiles, readDirectory, readFileData, serverLogParams, splitFilePath } from './fileUtils';

/**
 * Возвращает множество файлов логов сервера
 * @returns Массив объектов файлов ошибок
 */
const findMany = async (requestParams: Record<string, string>): Promise<ISystemFile[]> => {
  const logPath = path.join(process.cwd(), config.LOG_PATH);

  if (!(await checkFileExists(logPath))) {
    throw new Error(`${logPath} не существует или не доступна для чтения.`);
  }

  let files: ISystemFile[] = [];

  const params = Object.entries(requestParams).reduce((prev: IParamsInfo, [key, value]) => {
    if (value) {
      return { ...prev, [key]: { ...serverLogParams[key], value } };
    }
    return prev;
  }, {});

  const { searchQuery: { value: searchQuery } = { value: '' } } = params;
  delete params.searchQuery;

  const fileNameList = await readDirectory(logPath, false);

  for (const fileName of fileNameList) {
    try {
      const file = await splitFilePath(fileName);
      if (file) {
        const { ...fileParams } = params;

        const matched = isAllParamMatched(file, fileParams);
        // Если все параметры совпадают
        if (matched) {
          const foundText = searchQuery ? await searchTextInFile(fileName, searchQuery as string) : false;
          // Если есть текст для поиска и он найден или его нет, то добавляем файл в список
          if (!searchQuery || (searchQuery && foundText)) {
            files = [...files, file];
          }
        }
      }
    } catch (err) {
      log.warn(`Ошибка при обработке файла ${fileName} - ${err}`);
    }
  }

  const sortedFiles = files.sort((a, b) => new Date(b.mdate).getTime() - new Date(a.mdate).getTime());

  return getListPartByParams<ISystemFile>(sortedFiles, params);
};

/**
 * Возвращает содержание файла ошибок сервера по ИД
 * @param id ИД сформированный из названия файла
 * @returns содержание найденного файла
 **/
const getContent = async (file: IFileParams, { start, end }: Record<string, number>): Promise<IServerLogResponse> => {
  const fileText = await readFileData<string>(file, start, end);
  const fileStat = await stat(path.join(process.cwd(), config.LOG_PATH, file.id));
  const isEndOfFile: boolean = end === undefined ? true : fileStat.size <= end;

  return {
    //Зачем?
    isFinished: isEndOfFile,
    textFile: fileText,
  };
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
