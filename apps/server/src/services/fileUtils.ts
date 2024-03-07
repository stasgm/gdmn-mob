/* eslint-disable no-await-in-loop */
import path from 'path';
import { readdir, unlink, stat, rename } from 'fs/promises';

import { ISystemFile, IExtraFileInfo, IFileParams, INamedEntity, IFileActionResult, IPathParams } from '@lib/types';

import {
  log,
  BYTES_PER_KB,
  MSEС_IN_DAY,
  getListPartByParams,
  isAllParamMatched,
  prepareParams,
  readFileByChunks,
  searchTextInFile,
  writeFileByChunks,
  collectionNames,
} from '../utils';

import config from '../../config';

import { InnerErrorException, InvalidParameterException } from '../exceptions';

import { IParamsInfo } from '../types';

import { getDb } from './dao/db';

export const deviceLogFolder = 'deviceLogs';
export const erpLogFileName = 'erpLog.txt';
export const serverLogFolder = 'serverLogs';

export const deviceLogParams: IParamsInfo = {
  producerId: { itemKey: 'producer', property: 'id', fullMatch: true },
  deviceId: { itemKey: 'device', property: 'id', fullMatch: true },
  filterText: { itemKey: 'id' },
  searchQuery: { itemKey: 'id' },
  uid: { itemKey: 'uid' },
  dateFrom: { itemKey: 'date', comparator: (a: number, b: number) => a >= b },
  dateTo: { itemKey: 'date', comparator: (a: number, b: number) => a <= b },
  mDateFrom: { itemKey: 'mdate', comparator: (a: number, b: number) => a >= b },
  mDateTo: { itemKey: 'mdate', comparator: (a: number, b: number) => a <= b },
};

export const fileParams: IParamsInfo = {
  consumerId: { itemKey: 'consumer', property: 'id', fullMatch: true },
  producerId: { itemKey: 'producer', property: 'id', fullMatch: true },
  deviceId: { itemKey: 'device', property: 'id', fullMatch: true },
  folder: { itemKey: 'folder' },
  fileName: { itemKey: 'id' },
  filterText: { itemKey: 'id' },
  searchQuery: { itemKey: 'id' },
  uid: { itemKey: 'uid' },
  dateFrom: { itemKey: 'date', comparator: (a: number, b: number) => a >= b },
  dateTo: { itemKey: 'date', comparator: (a: number, b: number) => a <= b },
  mDateFrom: { itemKey: 'mdate', comparator: (a: number, b: number) => a >= b },
  mDateTo: { itemKey: 'mdate', comparator: (a: number, b: number) => a <= b },
};

export const serverLogParams: IParamsInfo = {
  filterText: { itemKey: 'id' },
  searchQuery: { itemKey: 'id' },
  dateFrom: { itemKey: 'date', comparator: (a: number, b: number) => a >= b },
  dateTo: { itemKey: 'date', comparator: (a: number, b: number) => a <= b },
  mDateFrom: { itemKey: 'mdate', comparator: (a: number, b: number) => a >= b },
  mDateTo: { itemKey: 'mdate', comparator: (a: number, b: number) => a <= b },
};

export const readDirectory = async (
  root: string,
  recursive = false,
  excludeFolders: string[] | undefined = undefined,
) => {
  try {
    const files = await readdir(root);
    const exclude: string[] = (excludeFolders ?? []).map((i) => i.toLocaleLowerCase());

    const res = await files.reduce(async (arr: Promise<string[]>, curr: string) => {
      let accum: string[] = await arr;
      const fullCurr = path.join(root, curr);

      const isDir = (await stat(fullCurr)).isDirectory();
      if (isDir) {
        if (recursive && !exclude.includes(curr.toLocaleLowerCase())) {
          const subFiles = await readDirectory(fullCurr, recursive, excludeFolders);
          accum = [...accum, ...subFiles];
        }
      } else {
        accum = [...accum, fullCurr];
      }
      return accum;
    }, Promise.resolve([]));
    return res;
  } catch (err) {
    log.error(`readDirectory: Ошибка чтения директории - ${err}`);
    return [];
  }
};

export const getFilesByParams = async <T>(fileNameList: string[], params: IParamsInfo): Promise<T[]> => {
  const { searchQuery: { value: searchQuery } = { value: '' } } = params;
  delete params.searchQuery;

  let files: ISystemFile[] = [];

  // Проверяем каждый файл из списка на соответствие параметрам
  for (const fileName of fileNameList) {
    try {
      const file = await splitFilePath(fileName);
      if (file) {
        const { ...fileParams } = params;
        const matched = isAllParamMatched(file, fileParams);
        // Если все параметры совпадают
        if (matched) {
          const foundText = searchQuery ? await searchTextInFile(fileName, searchQuery as string) : false;
          // Если есть текст для поиска и он найден или его нет, то добавляем файл в список
          if (!searchQuery || (searchQuery && foundText)) {
            files = [...files, file];
          }
        }
      }
    } catch (err) {
      log.warn(`Ошибка при обработке файла ${fileName} - ${err}`);
    }
  }

  const sortedFiles = files.sort((a, b) => new Date(b.mdate).getTime() - new Date(a.mdate).getTime());
  return getListPartByParams<T>(sortedFiles, params);
};

/**
 * Чтение файла (json или текст)
 * @param file
 * @returns
 */
export const readFileData = async <T = string | object>(
  file: IFileParams,
  start?: number,
  end?: number,
): Promise<T> => {
  const fileName = fileObj2FullFileName(file);

  try {
    const data = await readFileByChunks(fileName, false, start, end);

    // Попытка преобразования данных из JSON
    try {
      return JSON.parse(data) as T;
    } catch (err) {
      // Если не удалось преобразовать в JSON, возвращаем как текст
      return data as T;
    }
  } catch (error) {
    throw new InnerErrorException(`Ошибка чтения файла ${fileName} - ${error}`);
  }
};

export const writeDataToFile = async (file: IFileParams, data: any): Promise<void> => {
  const fileName = fileObj2FullFileName(file);
  try {
    return await writeFileByChunks(fileName, typeof data === 'string' ? data : JSON.stringify(data, undefined, 2));
  } catch (err) {
    throw new InnerErrorException(`Ошибка записи файла ${fileName} - ${err}`);
  }
};

export const checkDeviceLogsFiles = async (): Promise<void> => {
  const { devices } = getDb();
  // Берем все файлы из папки логов устройств
  const files = (await readDirectory(getDb().dbPath, true)).filter((fileName) => {
    const parts = fileName.split(path.sep);
    const lastFolder = parts[parts.length - 2];
    return lastFolder === deviceLogFolder;
  });

  for (const file of files) {
    try {
      const re = /from_(.+)_dev_(.+)\.json/gi;
      const match = re.exec(file);
      if (!match) {
        log.error(`Invalid deviceLogs file name ${file}`);
        // eslint-disable-next-line no-await-in-loop
        await unlink(file);
      } else {
        const device = devices.findByField('uid', match[2]);

        if (!device) {
          // eslint-disable-next-line no-await-in-loop
          const fileStat = await stat(file);
          const fileDate = fileStat.birthtimeMs;
          if ((new Date().getTime() - fileDate) / MSEС_IN_DAY > config.FILES_SAVING_PERIOD_IN_DAYS) {
            // eslint-disable-next-line no-await-in-loop
            await unlink(file);
          }
        }
      }
    } catch (err) {
      log.warn(`Ошибка при удалении старого файла логов-- ${err}`);
    }
  }
};

export const checkFiles = async (): Promise<void> => {
  const defaultExclude = Object.values(collectionNames).map((i) => `${i}.json`);

  const root = getDb().dbPath;
  const files = await readDirectory(root, true, [...defaultExclude, deviceLogFolder]);

  for (const file of files) {
    try {
      const fileStat = await stat(file);
      const fileDate = fileStat.birthtimeMs;
      const period =
        file.toUpperCase().indexOf('DOCS') === -1 || file.toUpperCase().indexOf('MESSAGES') > 0
          ? config.FILES_SAVING_PERIOD_IN_DAYS
          : config.DOCS_SAVING_PERIOD_IN_DAYS;

      if ((new Date().getTime() - fileDate) / MSEС_IN_DAY > period) {
        await unlink(file);
      }
    } catch (err) {
      log.warn(`Ошибка при удалении старого файла-- ${err}`);
    }
  }

  try {
    await checkDeviceLogsFiles();
  } catch (err) {
    log.warn(`Ошибка при удалении старого файла логов-- ${err}`);
  }
};

/**
 * Получение информации о файле из его имени
  Если файл-сообщение
    новый формат сообщения -  _from_producerId_to_consumerId_dev_deviceUid__command.json
    старый формат сообщения - _from_producerId_to_consumerId_dev_deviceUid.json)
  то в имени файла полчаем отправителя, получателя и uid устройства
  Если файл-лог
    from_producerId_dev_deviceUid.json
  то в имени файла полчаем отправителя и uid устройства
  Если файл не соответствует формату, то возвращаем пустой объект
 * @param fileName
 * @returns
 */
const splitFileName = (fileName: string): IExtraFileInfo => {
  const isNewMessage = fileName.includes('__');
  const isMessage = fileName.includes('_to_');

  const getRx = (): RegExp =>
    isMessage
      ? isNewMessage
        ? /_from_(.+)_to_(.+)_dev_(.+)__(.+)\.json/gi
        : /_from_(.+)_to_(.+)_dev_(.+)\.json/gi
      : /from_(.+)_dev_(.+)\.json/gi;

  const reMessage = getRx();
  const fileNameParts = reMessage.exec(fileName);

  if (!fileNameParts) {
    // Может и не надо в логах писать об этом
    log.warn(`Неверный формат имени файла ${fileName}`);
    return {};
  }

  const { devices, users } = getDb();

  const producerId = fileNameParts[1];
  const producer = users.getNamedItem(producerId);

  if (!producer?.name) {
    log.warn(`Отправитель ${producerId} в файле ${fileName} не найден`);
  }

  let consumer: INamedEntity | undefined;
  let uid: string;

  // Если файл-сообщение, то в имени файла полчаем id получателя и uid устройства
  // Если файл-лог, то в имени файла полчаем id устройства
  if (isMessage) {
    const consumerId = fileNameParts[2];
    consumer = users.getNamedItem(consumerId);

    if (!consumer?.name) {
      log.warn(`Получатель ${consumerId} в файле ${fileName} не найден`);
    }

    uid = fileNameParts[3];
  } else {
    uid = fileNameParts[2];
  }

  const deviceByUid = devices.findByField('uid', uid);
  const device = deviceByUid ? { id: deviceByUid.id, name: deviceByUid.name } : undefined;

  if (!device) {
    log.warn(`Устройство ${uid} в файле ${fileName} не найдено`);
  }

  return {
    producer,
    consumer,
    device,
    uid,
  };
};

/**
 *  Получение информации о файле из его полного пути
    Если файл-сообщение, то возвращаем информацию о файле, отправителя, получателя и uid устройства
    Если файл-лог, то возвращаем информацию о файле, отправителе и uid устройства
    Если файл не соответствует формату, то возвращаем информацию о файле
 * @param filePath
 * @returns
 */
export const splitFilePath = async (filePath: string): Promise<ISystemFile | undefined> => {
  const dirName = path.dirname(filePath);
  const fileName = path.basename(filePath);
  let fileSystem: ISystemFile | undefined;

  try {
    const fileStat = await stat(filePath);
    fileSystem = {
      id: fileName,
      date: fileStat.birthtime.toISOString(),
      size: fileStat.size / BYTES_PER_KB,
      path: dirName,
      mdate: fileStat.mtime.toISOString(),
    };
  } catch (err) {
    throw new Error(`Ошибка получения информации о файле ${filePath} - ${err}`);
  }

  // Папка формата db_companyId/appSystemName/folderName/
  const re = /db_(.+)/gi;
  const match = re.exec(filePath);

  const pathParts = match ? match[1].split(path.sep) : undefined;

  if (pathParts?.length !== 4) {
    return fileSystem;
  }

  const { companies, appSystems } = getDb();

  const companyId = pathParts[0];
  const company = companies.getNamedItem(companyId);

  if (!company?.name) {
    log.warn(`Компания ${companyId} в файле ${filePath} не найдена`);
  }

  const appSystemName = pathParts[1];
  const appSystemByName = appSystems.findByField('name', appSystemName);
  const appSystem = appSystemByName ? { id: appSystemByName.id, name: appSystemByName.name } : undefined;

  if (!appSystem) {
    log.warn(`Подсистема ${appSystemName} в файле ${filePath} не найдена`);
  }

  const folder = pathParts[2];

  const fileInfo = splitFileName(fileName);

  return {
    ...fileSystem,
    folder,
    company,
    appSystem,
    producer: fileInfo.producer,
    consumer: fileInfo.consumer,
    device: fileInfo.device,
    uid: fileInfo.uid,
  };
};

export const deleteFileById = async (file: IFileParams): Promise<void> => {
  const fullName = fileObj2FullFileName(file);

  return await unlink(fullName);
};

export const getFolderList = async (pathSystem: string): Promise<string[]> => {
  try {
    const files = await readdir(pathSystem);
    const folders = await Promise.all(
      files.map(async (curr: string) => {
        const res = path.join(pathSystem, curr);
        const folder = path.basename(res);
        return (await stat(res)).isDirectory() ? folder : undefined;
      }),
    );

    return folders.filter((i) => i !== undefined) as string[];
  } catch (err) {
    throw new InnerErrorException(`Ошибка чтения директории ${pathSystem}  - ${err}`);
  }
};

export const moveFiles = async (files: IFileParams[], toFolder: string): Promise<IFileActionResult[]> => {
  const moveResults: IFileActionResult[] = [];

  await Promise.allSettled(
    files.map(async (file) => {
      const result: IFileActionResult = { file: file.id, success: false };

      try {
        const fileName = fileObj2FullFileName(file);
        const newFileName = fileObj2FullFileName({ ...file, folder: toFolder });
        await rename(fileName, newFileName);
        result.success = true;
      } catch (err) {
        result.error = err instanceof Error ? err.message : 'Ошибка перемещения файла';
      } finally {
        moveResults.push(result);
      }
    }),
  );

  return moveResults;
};

export const deleteFiles = async (files: IFileParams[]): Promise<IFileActionResult[]> => {
  const deleteResults: IFileActionResult[] = [];

  await Promise.allSettled(
    files.map(async (file) => {
      const result: IFileActionResult = { file: file.id, success: false };

      try {
        const fileName = fileObj2FullFileName(file);
        await unlink(fileName);
        result.success = true;
      } catch (err) {
        result.error = err instanceof Error ? err.message : 'Ошибка удаления файла';
      } finally {
        deleteResults.push(result);
      }
    }),
  );

  return deleteResults;
};

/**
 * Получение параметров файла из запроса
   Может быть или только id - имя файла или id и companyId, appSystemId, folder
 * @param params
 * @param query
 * @returns
 */
export const getFileParams = async (params: Record<string, string>, query: Record<string, any>) => {
  const file = prepareParams(query, ['companyId', 'appSystemId', 'folder']);

  return { id: params.id, ...file } as IFileParams;
};

export const getPath = (folders: string[], fn = '') => {
  const folderPath = path.join(getDb().dbPath, ...folders);
  return path.join(folderPath, fn);
};

export const getPathSystem = ({ companyId, appSystemId }: IPathParams) =>
  `db_${companyId}/${getDb().appSystems.findById(appSystemId)?.name}`;

/**
 * Преобразует объект файла в полное имя файла.
   Если указаны companyId, appSystemId, folder
   то возвращает в формате db_companyId/appSystemName/folder/fileName
   иначе возвращает fileName
 * @param file
 * @returns
 */
export const fileObj2FullFileName = (file: IFileParams): string => {
  // if (path.extname(file.id) !== '.json') {
  //   throw new InvalidParameterException(`Неправильное расширение файла ${file.id}`);
  // }

  if (file.folder === serverLogFolder) {
    return path.join(process.cwd(), config.LOG_PATH, file.id);
  }

  if (file.appSystemId || file.companyId || file.folder) {
    if (!file.companyId) {
      throw new InvalidParameterException('Параметр companyId не задан');
    }

    if (!file.appSystemId) {
      throw new InvalidParameterException('Параметр appSystemId не задан');
    }

    // if (!file.folder) {
    //   throw new InvalidParameterException('Параметр folder не задан');
    // }

    const { companies, appSystems } = getDb();

    const company = companies.findById(file.companyId);

    if (!company) {
      throw new InvalidParameterException(`Компания с id ${file.appSystemId} не найдена`);
    }

    const appSystemName = appSystems.findById(file.appSystemId)?.name;

    if (!appSystemName) {
      throw new InvalidParameterException(`Подсистема с id ${file.appSystemId} не найдена`);
    }

    return getPath([
      file.folder
        ? `db_${file.companyId}${path.sep}${appSystemName}${path.sep}${file.folder}${path.sep}${file.id}`
        : `db_${file.companyId}${path.sep}${appSystemName}${path.sep}${file.id}`,
    ]);
  }

  return getPath([file.id]);
};
