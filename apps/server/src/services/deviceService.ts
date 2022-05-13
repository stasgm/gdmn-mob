import { IDBDevice, IDevice, NewDevice } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { deviceStates } from '../utils/constants';

import { getDb } from './dao/db';

import { devices as mockDevices } from './data/devices';
import { getListPart, getNamedEntity } from './dao/utils';

/**
 * Добавляет одно устройство
 * @param {NewDevice} deviceData - данные устройства
 * @return объект устройства
 * */

const addOne = (deviceData: NewDevice): IDevice => {
  const { devices } = getDb();

  if (devices.data.find((i) => i.name === deviceData.name && i.companyId === deviceData.company?.id)) {
    throw new ConflictException(`Устройство с наименование ${deviceData.name} уже сущеcтвует`);
  }

  const device = devices.insert({
    id: '',
    name: deviceData.name,
    uid: '',
    state: deviceData.state || 'NON-REGISTERED',
    companyId: deviceData.company?.id,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  });

  return makeDevice(device);
};

/**
 * Обновляет устройство
 * @param {IDBDevice} device - устройство
 * @return обновленное устройство
 * */
const updateOne = (id: string, deviceData: Partial<IDevice>, params?: Record<string, string>): IDevice => {
  const { companies, devices } = getDb();

  const oldDevice = devices.findById(id);

  if (!oldDevice) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  // Проверяем есть ли в базе переданная компания
  let companyId = oldDevice.companyId;
  if (deviceData.company) {
    const company = companies.findById(deviceData.company.id);
    if (!company) {
      throw new DataNotFoundException('Компания не найдена');
    }
    companyId = company.id;
  }

  if (params) {
    if ('adminId' in params) {
      const company = companies.data.find((c) => c.id === companyId && c.adminId === params.adminId);
      if (!company) {
        throw new DataNotFoundException('Устройство не может быть отредактировано');
      }
    }
  }

  devices.update({
    id,
    name: deviceData.name || oldDevice.name,
    state: deviceData.state || oldDevice.state,
    uid: deviceData.uid || oldDevice.uid,
    companyId,
    creationDate: oldDevice.creationDate,
    editionDate: new Date().toISOString(),
  });

  const updatedDevice = devices.findById(id);

  if (!updatedDevice) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  return makeDevice(updatedDevice);
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = (id: string) => {
  const { devices, codes, deviceBindings } = getDb();

  if (!devices.data.find((device) => device.id === id)) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  devices.deleteById(id);
  deviceBindings.data.filter((b) => b.deviceId === id)?.forEach((b) => deviceBindings.deleteById(b.id));
  codes.data.filter((b) => b.deviceId === id)?.forEach((b) => codes.deleteById(b.id));
};

/**
 * Возвращает одно устройство
 * @param id ИД устройства
 * @returns
 */
const findOne = (id: string): IDevice => {
  const device = getDb().devices.findById(id);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  return makeDevice(device);
};

/**
 * Возвращает устройство по уникальному номеру
 * @param uid
 * @returns объект устройства
 */
const findOneByUid = (uid: string) => {
  const device = getDb().devices.data.find((i) => i.uid === uid);

  if (!device) return;

  return makeDevice(device);
};

/**
 * Возвращает множество устройств
 * @param params - параметры
 * @returns массив объектов устройств
 */
const findMany = (params: Record<string, string | number>): IDevice[] => {
  const { devices } = getDb();

  let deviceList;
  if (process.env.MOCK) {
    deviceList = mockDevices;
  } else {
    deviceList = devices.data;
  }

  deviceList = deviceList.filter((item: IDBDevice) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    let companyFound = true;

    if ('companyId' in newParams) {
      companyFound = item.companyId === newParams.companyId;
      delete newParams['companyId'];
    }

    /** filtering data */
    let filteredDevices = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const uid = typeof item.uid === 'string' ? item.uid.toUpperCase() : '';
        const newState = deviceStates[item.state];
        const state = typeof newState === 'string' ? newState.toUpperCase() : '';
        const creationDate = new Date(item.creationDate || '').toLocaleString('ru', { hour12: false });
        const editionDate = new Date(item.editionDate || '').toLocaleString('ru', { hour12: false });

        filteredDevices =
          name.includes(filterText) ||
          uid.includes(filterText) ||
          state.includes(filterText) ||
          creationDate.includes(filterText) ||
          editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return companyFound && filteredDevices && extraPredicate(item, newParams as Record<string, string>);
  });

  return getListPart(deviceList, params)?.map((i) => makeDevice(i));
};

/* TODO В звависимости от прав возвращать разный набор полей */
export const makeDevice = (device: IDBDevice): IDevice => ({
  id: device.id,
  name: device.name,
  company: getNamedEntity(device.companyId, getDb().companies),
  state: device.state,
  uid: device.uid,
  creationDate: device.creationDate,
  editionDate: device.editionDate,
});

export { addOne, updateOne, deleteOne, findOne, findOneByUid, findMany };
