import { IFileSystem } from '@lib/types';

import { readListFiles, getFile, deleteFileById, updateById } from './fileUtils';

/**
 * Возвращает множество файлов
 * @returns Массив объектов файлов
 */
const findMany = async (): Promise<IFileSystem[]> => {
  return await readListFiles();
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
/* Редактирует  файл по ИД
/* @param id ИД файла
 * @param fileData Новые данные файла
*/
const updateOne = async (id: string, fileData: any): Promise<void> => {
  return await updateById(id, fileData);
};

export { findMany, findOne, deleteOne, updateOne };
