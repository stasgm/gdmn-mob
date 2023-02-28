import { IFileSystem } from '@lib/types';

import { readListFiles, getFile, deleteFileById, updateById, deleteManyFiles } from './fileUtils';

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
/* Редактирует  файл по ИД
/* @param id ИД файла
 * @param fileData Новые данные файла
*/
const updateOne = async (id: string, fileData: any): Promise<void> => {
  return await updateById(id, fileData);
};

export { findMany, findOne, deleteOne, updateOne, deleteMany };
