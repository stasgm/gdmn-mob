import path from 'path';

import {
  IAddDeviceLogParams,
  IDeviceData,
  IDeviceLogEntry,
  IDeviceLogFile,
  IFileActionResult,
  IFileParams,
} from '@lib/types';

import { DataNotFoundException, InnerErrorException, InvalidParameterException } from '../exceptions';

import config from '../../config';

import { getDb } from './dao/db';
import {
  deleteFileById,
  deleteFiles,
  deviceLogFolder,
  deviceLogParams,
  fileObj2FullFileName,
  getFilesByParams,
  readDirectory,
  readFileData,
  writeDataToFile,
} from './fileUtils';

/**
 * Добавляет запись с ошибкой в файл
 * по пользователю и устройству
 * @param {IDeviceLogEntry} deviceLog - сообщение с ошибкой
 * @param {string} producerId - идентификатор отправителя
 * @param {string} appSystemId - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @param {string} deviceId- идентификатор устройства
 * @return void
 * */
const addOne = async ({
  appVersion,
  appSettings,
  deviceLog,
  producerId,
  appSystemId,
  companyId,
  deviceId,
}: IAddDeviceLogParams): Promise<void> => {
  const { companies, appSystems, users } = getDb();
  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (!users.findById(producerId)) {
    throw new DataNotFoundException('Отправитель не найден');
  }

  if (!appSystems.findById(appSystemId)) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  const file = { id: `from_${producerId}_dev_${deviceId}.json`, companyId, appSystemId, folder: deviceLogFolder };
  let oldDeviceLog: IDeviceLogEntry[] = [];

  try {
    const oldDeviceData = await readFileData<IDeviceData | IDeviceLogEntry[]>(file);
    const isArray = Array.isArray(oldDeviceData);
    const isObject = typeof oldDeviceData === 'object' && 'deviceLog' in oldDeviceData;

    // если файл существует, но его содержимое не соответствует ожидаемому формату
    if (!(isArray || isObject || oldDeviceData === undefined)) {
      throw new InnerErrorException(`Файл ${file.id} содержит неверный формат данных`);
    }

    // если файл содержит массив (старый формат), то берем его, иначе берем поле deviceLog (новый формат)
    oldDeviceLog = isArray ? [...oldDeviceData] : oldDeviceData?.deviceLog || [];
  } catch (err) {
    //Если файл не найден, то значит дальше создадим новый
  }
  const delta = oldDeviceLog.length + deviceLog.length - config.DEVICE_LOG_MAX_LINES;

  // если количество записей превышает максимальное, удаляем старые записи
  if (delta > 0) oldDeviceLog.splice(0, delta);

  return await writeDataToFile(file, { appVersion, appSettings, deviceLog: [...oldDeviceLog, ...deviceLog] });
};

/**
 * Удаляет  файла по ИД
 * @param id ИД файла
 **/
const deleteOne = async (file: IFileParams): Promise<void> => {
  return await deleteFileById(file);
};

/**
 * Возвращает содержание лог-файла устройства
 * @param id ИД сформированный из названия файла
 * @returns Объект из JSON  найденного файла
 **/
const getOne = async (file: IFileParams): Promise<IDeviceData | IDeviceLogEntry[]> => {
  const ext = path.extname(file.id);

  if (ext !== '.json') {
    throw new InvalidParameterException(`Неподдерживаемое расширение файла: ${ext}`);
  }

  const data = await readFileData<IDeviceData | IDeviceLogEntry[]>(file);
  const isArray = Array.isArray(data);
  const isObject = typeof data === 'object' && 'deviceLog' in data;

  // если файл существует, но его содержимое не соответствует ожидаемому формату
  if (!(isArray || isObject)) {
    throw new InnerErrorException(`Файл ${file.id} содержит неверный формат данных`);
  }
  const deviceLog: IDeviceData = isObject ? data : { appVersion: '0.0.1', appSettings: {}, deviceLog: data };

  return deviceLog;
};

/**
 * Возвращает множество лог-файлов по указанным параметрам
 * @returns Массив объектов лог-файлов
 */
const findMany = async (requestParams: Record<string, string>): Promise<IDeviceLogFile[]> => {
  const { companyId, appSystemId, ...params } = requestParams;

  const folderPath = fileObj2FullFileName({
    companyId,
    appSystemId,
    folder: appSystemId ? deviceLogFolder : '',
  });

  let fileNameList = await readDirectory(folderPath, true);

  // Если не укаказана подсистема, то возьмем файлы только из папок логов устройств
  if (!appSystemId) {
    fileNameList = fileNameList.filter((fileName) => {
      const parts = fileName.split(path.sep);
      const lastFolder = parts[parts.length - 2];
      return lastFolder === deviceLogFolder;
    });
  }

  return (await getFilesByParams<IDeviceLogFile>(fileNameList, deviceLogParams, params)).filter(
    (file) => !!file.device && !!file.company && !!file.appSystem && !!file.producer,
  );
};

/**
 * Удаляет множество файлов по массиву ИД
 * @param id ИД файла
 **/
const deleteMany = async (files: IFileParams[]): Promise<IFileActionResult[]> => {
  return await deleteFiles(files);
};

export { addOne, findMany, getOne, deleteOne, deleteMany };
