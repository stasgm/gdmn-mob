import { rename } from 'fs/promises';

import { IFileParams, IPathParams } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { getDb } from './dao/db';
import { erpLogFileName, getPath, getPathSystem, readFileData } from './fileUtils';

const addOne = async (params: IPathParams, file: any): Promise<void> => {
  const { companies, appSystems } = getDb();

  if (!companies.findById(params.companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const appSystem = appSystems.findById(params.appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const destinationPath = getPath([getPathSystem(params)], erpLogFileName);
  await rename(file.filepath, destinationPath);
  return;
};

const getContent = async (file: IFileParams): Promise<string | object> => {
  return await readFileData(file);
};

export { addOne, getContent };
