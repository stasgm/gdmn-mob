import { IFileSystem } from '@lib/types';

import { readListFiles } from './fileUtils';

/**
 * Возвращает множество файлов
 * @returns Массив объектов файлов
 */
const findMany = async (): Promise<IFileSystem[]> => {
  return await readListFiles();
};

export { findMany };
