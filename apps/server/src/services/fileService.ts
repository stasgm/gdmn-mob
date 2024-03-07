/* eslint-disable no-await-in-loop */
import path from 'path';

import { ISystemFile, IPathParams, IFileParams, IFileActionResult } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { IParamsInfo } from '../types';

import {
  getFolderList,
  moveFiles,
  deleteFiles,
  getFilesByParams,
  readDirectory,
  deleteFileById,
  readFileData,
  getPathSystem,
  writeDataToFile,
  fileParams,
} from './fileUtils';

import { getDb } from './dao/db';

/**
 * Возвращает множество файлов
   Если есть компания и подсистема, то возвращаем файлы из папки ./db_companyId/appSystemName
   Если есть компания, но нет подсистемы, то возвращаем файлы из папки ./db_companyId
   Если нет компании, то возвращаем файлы из папки ./
 * @returns Массив объектов файлов
 */
const findMany = async (params: Record<string, string>): Promise<ISystemFile[]> => {
  const { dbPath, companies, appSystems } = getDb();

  let fileNameList: string[] = [];

  if ('companyId' in params) {
    const company = companies.findById(params['companyId']);

    if (!company) {
      throw new DataNotFoundException(`Компания с id=${params['companyId']} не найдена`);
    }

    delete params['companyId'];

    const appSystem = 'appSystemId' in params ? appSystems.findById(params['appSystemId']) : undefined;
    if ('appSystemId' in params && !appSystem) {
      throw new DataNotFoundException(`Подсистема с id=${params['appSystemId']} не найдена`);
    }

    delete params['appSystemId'];

    const folderPath = appSystem
      ? path.join(dbPath, `db_${company.id}`, appSystem.name || '')
      : path.join(dbPath, `db_${company.id}`);

    fileNameList = await readDirectory(folderPath, true);
  } else {
    fileNameList = await readDirectory(dbPath);
  }

  const paramsWithValues = Object.entries(params).reduce((prev: IParamsInfo, [key, value]) => {
    if (value) {
      return { ...prev, [key]: { ...fileParams[key], value } };
    }
    return prev;
  }, {});

  return await getFilesByParams<ISystemFile>(fileNameList, paramsWithValues);
};

/**
 * Возвращает содержимое файла
 * @param file
 * @returns
 */
const getContent = async (file: IFileParams): Promise<string | object> => {
  return await readFileData(file);
};

/**
 * Удаляет файл по имени файла, сформированного из параметров
 * @param file
 */
const deleteOne = async (file: IFileParams): Promise<void> => {
  await deleteFileById(file);
};

/**
 * Удаляет множество файлов по именам файлов
 * @param files
 * @returns
 */
const deleteMany = async (files: IFileParams[]): Promise<IFileActionResult[]> => {
  return await deleteFiles(files);
};

/**
 * Перемещает множество файлов в папку
 * @param files
 * @param toFolder
 * @returns
 */
const moveMany = async (files: IFileParams[], toFolder: string): Promise<IFileActionResult[]> => {
  return await moveFiles(files, toFolder);
};

/**
 * Редактирует файл
 * @param file
 * @param data
 * @returns
 */
const updateOne = async (file: IFileParams, data: string): Promise<void> => {
  return await writeDataToFile(file, data);
};

/**
 * Возвращает массив папок по компании и подсистеме
 * @returns Массив названий папок
 */
const getFolders = async (pathParams: IPathParams): Promise<string[]> => {
  const { dbPath, companies, appSystems } = getDb();

  if (!companies.findById(pathParams.companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = appSystems.findById(pathParams.appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const pathSystem = path.join(dbPath, getPathSystem(pathParams));

  return await getFolderList(pathSystem);
};

export { findMany, getContent, deleteOne, updateOne, deleteMany, getFolders, moveMany };
