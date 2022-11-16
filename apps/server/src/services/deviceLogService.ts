import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { saveDeviceLogFile, getFilesObject } from './errorLogUtils';

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

// /**
//  * Обновляет подсистему по ИД
//  * @param id ИД подсистемы
//  * @param appSystemData Новые данные подсистемы
//  * @returns Обновленный объект подсистемы
//  */
// const updateOne = (id: string, appSystemData: Partial<IAppSystem>): IAppSystem => {
//   const { appSystems } = getDb();

//   const appSystemObj = appSystems.findById(id);

//   if (!appSystemObj) {
//     throw new DataNotFoundException('Подсистема не найдена');
//   }

//   if (appSystems.data.find((el) => el.name === appSystemData.name && el.id !== appSystemData.id)) {
//     throw new ConflictException(`Подсистема с названием ${appSystemData.name} уже существует`);
//   }

//   appSystems.update({
//     id,
//     name: appSystemData.name || appSystemObj.name,
//     description: appSystemData.description === undefined ? appSystemObj.description : appSystemData.description,
//     creationDate: appSystemObj.creationDate,
//     editionDate: new Date().toISOString(),
//   });

//   const updatedAppSystem = appSystems.findById(id);

//   if (!updatedAppSystem) {
//     throw new DataNotFoundException('Подсистема не найдена');
//   }

//   return updatedAppSystem;
// };

// /**
//  * Удаляет подсистему по ИД
//  * @param id ИД подсистемы
//  */
// const deleteOne = (id: string): void => {
//   const { appSystems } = getDb();

//   if (!appSystems.findById(id)) {
//     throw new DataNotFoundException('Подсистема не найдена');
//   }

//   appSystems.deleteById(id);
// };

// /**
//  * Возвращает подсистему по ИД
//  * @param id ИД подсистемы
//  * @returns Объект найденной подсистемы
//  */
// const findOne = (id: string): IAppSystem => {
//   const appSystem = getDb().appSystems.findById(id);

//   if (!appSystem) {
//     throw new DataNotFoundException('Подсистема не найдена');
//   }

//   return appSystem;
// };

// /**
//  * Возвращает множество подсистем по указанным параметрам
//  * @param params Параметры поиска
//  * @returns Массив объектов подсистем
//  */
const findMany = async (): Promise<IDeviceLogFiles[]> => {
  return await getFilesObject();
};

export { addOne, findMany };
