import { IFileSystem } from '@lib/types';

import { readListFiles, getFile } from './fileUtils';

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

export { findMany, findOne };
