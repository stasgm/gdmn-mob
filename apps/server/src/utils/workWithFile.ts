/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { promises } from 'fs';
import path from 'path';
import log from '../utils/logger';

export const readFile = async <T>(filename: string): Promise<T | undefined> => {
  try {
    const result = await promises.readFile(filename, { encoding: 'utf8', flag: 'r' });

    const data = JSON.parse(result) as T;

    log.info(`Successful reading: ${filename}`);

    if (Array.isArray(data) && data.length) return data;

    if (data instanceof Object) return data;
    return undefined;
  } catch (err) {
    log.warn(`Error reading data to file ${filename} - ${err}`);
    return undefined;
  }
};

export const writeFile = async ({ filename, data }: { filename: string; data: string }): Promise<void> => {
  try {
    await promises.mkdir(path.dirname(filename), { recursive: true });
    await promises.writeFile(filename, data, { encoding: 'utf8', flag: 'w' });
    log.info(`Successful writing: ${filename}`);
  } catch (err) {
    log.warn(`Error writing data to file ${filename} - ${err}`);
  }
};

export const removeFile = async (filename: string): Promise<string> => {
  try {
    await promises.unlink(filename);
    log.info('Successful remove file');
    return 'OK';
  } catch (err) {
    log.warn(`Error removing to file ${filename} - ${err}`);
    return 'ERROR';
  }
};
