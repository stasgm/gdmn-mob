import path from 'path';

import { IDeviceData, IDeviceLog, IDeviceLogFiles, IFileActionResult, IFileParams, INewDeviceLog } from '@lib/types';

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
 * @param {IDeviceLog} deviceLog - сообщение с ошибкой
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
}: INewDeviceLog): Promise<void> => {
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
  let oldDeviceLogs: IDeviceLog[] = [];

  try {
    const oldDeviceData = await readFileData<IDeviceData | IDeviceLog[]>(file);
    const isArray = Array.isArray(oldDeviceData);
    const isObject = typeof oldDeviceData === 'object' && 'logs' in oldDeviceData;

    // если файл существует, но его содержимое не соответствует ожидаемому формату
    if (!(isArray || isObject || oldDeviceData === undefined)) {
      throw new InnerErrorException(`Файл ${file.id} содержит неверный формат данных`);
    }

    // если файл содержит массив (старый формат), то берем его, иначе берем поле logs (новый формат)
    oldDeviceLogs = isArray ? [...oldDeviceData] : oldDeviceData?.logs || [];
  } catch (err) {
    //Если файл не найден, то значит дальше создадим новый
  }
  const delta = oldDeviceLogs.length + deviceLog.length - config.DEVICE_LOG_MAX_LINES;

  // если количество записей превышает максимальное, удаляем старые записи
  if (delta > 0) oldDeviceLogs.splice(0, delta);

  return await writeDataToFile(file, { appVersion, appSettings, logs: [...oldDeviceLogs, ...deviceLog] });
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
const getContent = async (file: IFileParams): Promise<IDeviceLog[]> => {
  const ext = path.extname(file.id);
  if (ext !== '.json') {
    throw new InvalidParameterException(`Неподдерживаемое расширение файла: ${ext}`);
  }

  return await readFileData<IDeviceLog[]>(file);
};

/**
 * Возвращает множество лог-файлов по указанным параметрам
 * @returns Массив объектов лог-файлов
 */
const findMany = async (requestParams: Record<string, string>): Promise<IDeviceLogFiles[]> => {
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

  return await getFilesByParams<IDeviceLogFiles>(fileNameList, deviceLogParams, params);
};

/**
 * Удаляет множество файлов по массиву ИД
 * @param id ИД файла
 **/
const deleteMany = async (files: IFileParams[]): Promise<IFileActionResult[]> => {
  return await deleteFiles(files);
};

export { addOne, findMany, getContent, deleteOne, deleteMany };
