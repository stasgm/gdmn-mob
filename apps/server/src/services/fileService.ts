/* eslint-disable no-await-in-loop */
import { ISystemFile, IFileParams, IFileActionResult, IFolderList, IDBCompany, IAppSystem } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import {
  getFolderList,
  moveFiles,
  deleteFiles,
  getFilesByParams,
  readDirectory,
  deleteFileById,
  readFileData,
  writeDataToFile,
  fileParams,
  getSystemFilePath,
  fileObj2FullFileName,
} from './fileUtils';

import { getDb } from './dao/db';

/**
 * Возвращает множество файлов
   Если есть компания и подсистема, то возвращаем файлы из папки ./db_companyId/appSystemName
   Если есть компания, но нет подсистемы, то возвращаем файлы из папки ./db_companyId
   Если нет компании, то возвращаем файлы из папки ./
 * @returns Массив объектов файлов
 */
const findMany = async (requestParams: Record<string, string>): Promise<ISystemFile[]> => {
  const { companyId, appSystemId, ...params } = requestParams;

  const folderPath = fileObj2FullFileName({ companyId, appSystemId });

  const fileNameList = await readDirectory(folderPath, !!companyId);

  return await getFilesByParams<ISystemFile>(fileNameList, fileParams, params);
};

/**
 * Возвращает содержимое файла
 * @param file
 * @returns
 */
const getOne = async (file: IFileParams): Promise<string | object> => {
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
const getFolders = async (params: Record<string, string>): Promise<IFolderList[]> => {
  const { companies, appSystems } = getDb();

  const folderList: { companyId: string; appSystemId: string; folderList: string[] }[] = [];

  const filteredCompanies: IDBCompany[] = params.companyId
    ? (() => {
        const company = companies.findById(params.companyId);
        if (!company) {
          throw new DataNotFoundException('Компания не найдена');
        }
        return [company];
      })()
    : [...companies.data];

  const filteredAppSystems: IAppSystem[] = params.appSystemId
    ? (() => {
        const appSystem = appSystems.findById(params.appSystemId);
        if (!appSystem) {
          throw new DataNotFoundException('Подсистема не найдена');
        }
        return [appSystem];
      })()
    : [...appSystems.data];

  for (const company of filteredCompanies) {
    for (const appSystem of filteredAppSystems) {
      const pathSystem = getSystemFilePath({ companyId: company.id, appSystemId: appSystem.id });
      const folders = await getFolderList(pathSystem);
      if (folders.length === 0) {
        continue;
      }
      folderList.push({ companyId: company.id, appSystemId: appSystem.id, folderList: folders });
    }
  }

  return folderList;
};

export { findMany, getOne, deleteOne, updateOne, deleteMany, getFolders, moveMany };
