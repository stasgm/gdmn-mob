import { IFileSystem, IPathParams } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import {
  readListFiles,
  getFile,
  deleteFileById,
  updateById,
  deleteManyFiles,
  getListFolders,
  moveManyFiles,
} from './fileUtils';

import { getDb } from './dao/db';

/**
 * Возвращает множество файлов
 * @returns Массив объектов файлов
 */
const findMany = async (params: Record<string, string | number>): Promise<IFileSystem[]> => {
  return await readListFiles(params);
};

//**
//  * Возвращает содержание файла  по ИД
//  * @param id ИД сформированный из названия файла
//  * @returns Объект из JSON  найденного файла
//  */
const findOne = async (id: string): Promise<any> => {
  return await getFile(id);
};

/**
/* Удаляет  файл по ИД
/* @param id ИД файла
*/
const deleteOne = async (id: string): Promise<void> => {
  return await deleteFileById(id);
};

/**
/* Удаляет множество файлов по массиву ИД
/* @param id ИД файла
*/
const deleteMany = async (ids: string[]): Promise<void> => {
  return await deleteManyFiles(ids);
};

/**
/* Перемещает множество файлов по массиву ИД и названию папаки
/* @param ids ИД файла массив
/* @param folderName наименование папки, в которую перемещаем
*/
const moveMany = async (ids: string[], folderName: string): Promise<void> => {
  return await moveManyFiles(ids, folderName);
};

/**
/* Редактирует  файл по ИД
/* @param id ИД файла
 * @param fileData Новые данные файла
*/
const updateOne = async (id: string, fileData: any): Promise<void> => {
  return await updateById(id, fileData);
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

export { findMany, findOne, deleteOne, updateOne, deleteMany, getFolders, moveMany };
