import { rename, stat } from 'fs/promises';

import { IErpLogResponse } from '@lib/types';

import { DataNotFoundException } from '../exceptions';
import { getPath, getPathSystem, readTextFile } from '../utils/fileHelper';

import { getDb } from './dao/db';

const addOne = async (companyId: string, appSystemId: string, file: any): Promise<void> => {
  const { companies, appSystems } = getDb();

  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = appSystems.findById(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const destinationPath = getPath([getPathSystem({ companyId, appSystemId })], 'erpLog.txt');
  await rename(file.filepath, destinationPath);
  return;
};

const findOne = async (
  companyId: string,
  appSystemId: string,
  start?: number,
  end?: number,
): Promise<IErpLogResponse> => {
  const { companies, appSystems } = getDb();

  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = appSystems.findById(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const fullName = getPath([getPathSystem({ companyId, appSystemId })], 'erpLog.txt');

  try {
    const fileText = await readTextFile<string>(fullName, start, end);
    const fileStat = await stat(fullName);

    return {
      isFinished: !end || fileStat.size <= end,
      textFile: fileText,
    };
  } catch (err) {
    throw new DataNotFoundException(
      `Невозможно прочитать ERP лог для компании '${companyId} и подсистемы ${appSystemId}: ${err}`,
    );
  }
};

export { addOne, findOne };
