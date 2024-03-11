/* eslint-disable @typescript-eslint/no-unused-vars */
import { rename } from 'fs/promises';

import { IFileParams, IPathParams } from '@lib/types';

import { erpLogFileName, fileObj2FullFileName, readFileData } from './fileUtils';

const addOne = async (requestParams: IPathParams, file: any): Promise<void> => {
  const { companyId, appSystemId, ...params } = requestParams;

  const fullFileName = fileObj2FullFileName({
    companyId,
    appSystemId,
    id: erpLogFileName,
  });

  return await rename(file.filepath, fullFileName);
};

const getOne = async (file: IFileParams): Promise<string | object> => {
  return await readFileData(file);
};

export { addOne, getOne };
