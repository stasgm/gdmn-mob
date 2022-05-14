import { IDBDeviceBinding, IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';
import { extraPredicate, getListPart } from '../utils/helpers';

import { deviceStates } from '../utils/constants';

import { getDb } from './dao/db';

/**
 * Добавляет одно устройство
 * @param {NewDeviceBinding} deviceBinding - данные привязки устройства
 * @return объект привязки устройства
 * */

const addOne = (deviceBinding: NewDeviceBinding): IDeviceBinding => {
  const { deviceBindings, users, devices } = getDb();

  const user = users.findById(deviceBinding.user.id);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  const device = devices.findById(deviceBinding.device.id);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  if (deviceBindings.data.find((i) => i.deviceId === deviceBinding.device.id && i.userId === deviceBinding.user.id)) {
    throw new ConflictException('Данное устройство уже добавлено пользователю');
  }

  const binding = deviceBindings.insert({
    id: '',
    state: deviceBinding.state,
    deviceId: deviceBinding.device.id,
    userId: deviceBinding.user.id,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  });

  return makeDeviceBinding(binding);
};

/**
 * Обновляет связь с устройством
 * @param {string} id - ИД устройства
 * @param {Partial<IDeviceBinding>} bindingData - данные привязки устройства
 * @return обновленный объект привязк устройства
 * */
const updateOne = (id: string, bindingData: Partial<IDeviceBinding>): IDeviceBinding => {
  const { deviceBindings, users } = getDb();
  const oldDeviceBinding = deviceBindings.findById(id);

  if (!oldDeviceBinding) {
    throw new DataNotFoundException('Связь с устройством не найдена');
  }

  // Проверяем есть ли в базе переданный пользователь
  let userId = oldDeviceBinding.userId;
  if (bindingData.user) {
    const user = users.findById(bindingData.user.id);
    if (!user) {
      throw new DataNotFoundException('Пользователь не найден');
    }
    userId = user.id;
  }

  // Проверяем есть ли в базе переданное устройство
  let deviceId = oldDeviceBinding.userId;
  if (bindingData.device) {
    const device = getDb().devices.findById(bindingData.device.id);
    if (!device) {
      throw new DataNotFoundException('Устройство не найдено');
    }
    deviceId = device.id;
  }

  deviceBindings.update({
    id,
    userId,
    state: bindingData.state || oldDeviceBinding.state,
    deviceId,
    creationDate: bindingData.creationDate,
    editionDate: new Date().toISOString(),
  });

  const updatedBinding = deviceBindings.findById(id);

  if (!updatedBinding) {
    throw new DataNotFoundException('Привязка устройства не найдена');
  }

  return makeDeviceBinding(updatedBinding);
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = (id: string): void => {
  const { deviceBindings } = getDb();

  if (!deviceBindings.findById(id)) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  deviceBindings.deleteById(id);
};

/**
 * Возвращает одну привязку устройства
 * @param id ИД привязки устройства
 * @returns
 */
const findOne = (id: string): IDeviceBinding => {
  const deviceBinding = getDb().deviceBindings.findById(id);

  if (!deviceBinding) {
    throw new DataNotFoundException('Связь с устройством не определена');
  }

  return makeDeviceBinding(deviceBinding);
};

/**
 *  Возвращает множество привязок по указанным параметрам
 * @param params - параметры
 * @returns
 */
const findMany = (params: Record<string, string>): IDeviceBinding[] => {
  const { devices, deviceBindings } = getDb();

  let deviceBindingList = deviceBindings.data.filter((item) => {
    const newParams = { ...params };

    let userFound = true;

    if ('userId' in newParams) {
      userFound = item.userId?.includes(newParams.userId);
      delete newParams['userId'];
    }

    let deviceFound = true;

    if ('deviceId' in newParams) {
      deviceFound = item.deviceId?.includes(newParams.deviceId);
      delete newParams['deviceId'];
    }

    if ('companyId' in newParams) {
      delete newParams['companyId'];
    }

    delete newParams['filterText'];

    return userFound && deviceFound && extraPredicate(item, newParams);
  });

  const newParams = { ...params };

  if ('companyId' in newParams || 'filterText' in newParams) {
    deviceBindingList = deviceBindingList.filter((i: IDBDeviceBinding) => {
      const newParams = { ...params };

      const device = devices.findById(i.deviceId);
      if (!device) {
        throw new DataNotFoundException(`Устройство с ИД = ${i.deviceId} не найдено в таблице устройств`);
      }

      let companyIdFound = true;

      if ('companyId' in newParams) {
        companyIdFound = device?.companyId === newParams.companyId;
        delete newParams['companyId'];
      }

      let filteredCompanies = true;

      if ('filterText' in newParams) {
        const filterText: string = (newParams.filterText as string).toUpperCase();

        if (filterText) {
          const state = deviceStates[i.state].toUpperCase();
          const deviceName = device?.name.toUpperCase();
          const creationDate = new Date(i.creationDate || '').toLocaleString('ru', { hour12: false });
          const editionDate = new Date(i.editionDate || '').toLocaleString('ru', { hour12: false });

          filteredCompanies =
            deviceName.includes(filterText) ||
            state.includes(filterText) ||
            creationDate.includes(filterText) ||
            editionDate.includes(filterText);
        }

        delete newParams['filterText'];
      }

      return companyIdFound && filteredCompanies;
    });
  }

  return getListPart(deviceBindingList, params)?.map((i) => makeDeviceBinding(i));
};

export const makeDeviceBinding = (binding: IDBDeviceBinding): IDeviceBinding => {
  const { users, devices } = getDb();

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: binding.id,
    user: users.getNamedItem(binding.userId),
    device: devices.getNamedItem(binding.deviceId),
    state: binding.state,
    creationDate: binding.creationDate,
    editionDate: binding.editionDate,
  };
};

export { addOne, updateOne, deleteOne, findOne, findMany };
