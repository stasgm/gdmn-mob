import { IFileSystem, IPathParams, IFileObject } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import {
  readListFiles,
  getFile,
  deleteFileById,
  updateById,
  deleteManyFiles,
  getListFolders,
  moveManyFiles,
  searchFilesList,
} from './fileUtils';

import { getDb } from './dao/db';

/**
 * Возвращает множество файлов
 * @returns Массив объектов файлов
 */
const findMany = async (params: Record<string, string | number>): Promise<IFileSystem[]> => {
  return await readListFiles(params);
};

/**
 * Возвращает множество файлов
 * @returns Массив объектов файлов
 */
const searchInFiles = async (params: Record<string, string | number>): Promise<IFileSystem[]> => {
  return await searchFilesList(params);
};

//**
//  * Возвращает содержание файла  по ИД
//  * @param id ИД сформированный из названия файла
//  * @returns Объект из JSON  найденного файла
//  */
const findOne = async (idObj: IFileObject): Promise<any> => {
  return await getFile(idObj);
};

/**
/* Удаляет  файл по ИД
/* @param id ИД файла
*/
const deleteOne = async (idObj: IFileObject): Promise<void> => {
  return await deleteFileById(idObj);
};

/**
/* Удаляет множество файлов по массиву ИД
/* @param id ИД файла
*/
const deleteMany = async (ids: IFileObject[]): Promise<void> => {
  return await deleteManyFiles(ids);
};

/**
/* Перемещает множество файлов по массиву ИД и названию папаки
/* @param ids ИД файла массив
/* @param toFolder наименование папки, в которую перемещаем
*/
const moveMany = async (ids: IFileObject[], toFolder: string): Promise<void> => {
  return await moveManyFiles(ids, toFolder);
};

/**
/* Редактирует  файл по ИД
/* @param id ИД файла
 * @param fileData Новые данные файла
*/
const updateOne = async (idObj: IFileObject, fileData: any): Promise<void> => {
  return await updateById(idObj, fileData);
};

/**
 * Возвращает массив папок по компании и подсистеме
 * @returns Массив названий папок
 */
const getFolders = async (appPathParams: IPathParams): Promise<string[]> => {
  const { companies, appSystems } = getDb();

  if (!companies.findById(appPathParams.companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = appSystems.findById(appPathParams.appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }
  return await getListFolders(appPathParams);
};

export { findMany, findOne, deleteOne, updateOne, deleteMany, getFolders, moveMany, searchInFiles };
