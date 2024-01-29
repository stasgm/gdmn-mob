import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { saveDeviceLogFile, getFilesObject, getFile, deleteFileById, deleteManyFiles } from './errorLogUtils';

import { getDb } from './dao/db';

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
  deviceLog,
  producerId,
  appSystemId,
  companyId,
  deviceId,
}: {
  deviceLog: IDeviceLog[];
  producerId: string;
  appSystemId: string;
  companyId: string;
  deviceId: string;
}): Promise<void> => {
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

  return await saveDeviceLogFile(deviceLog, { companyId, appSystemId }, { producerId, deviceId });
};

/**
/* Удаляет  файла по ИД
/* @param id ИД файла
*/
const deleteOne = async (id: string): Promise<void> => {
  return await deleteFileById(id);
};

//**
//  * Возвращает содержание файла ошибок  по ИД
//  * @param id ИД сформированный из названия файла
//  * @returns Объект из JSON  найденного файла
//  */
const findOne = async (id: string): Promise<IDeviceLog[]> => {
  return await getFile(id);
};

/**
 * Возвращает множество файлов ошибок по указанным параметрам
 * @returns Массив объектов файлов ошибок
 */
const findMany = async (params: Record<string, string | number>): Promise<IDeviceLogFiles[]> => {
  return await getFilesObject(params);
};

/**
/* Удаляет множество файлов по массиву ИД
/* @param id ИД файла
*/
const deleteMany = async (ids: string[]): Promise<void> => {
  return await deleteManyFiles(ids);
};

export { addOne, findMany, findOne, deleteOne, deleteMany };
