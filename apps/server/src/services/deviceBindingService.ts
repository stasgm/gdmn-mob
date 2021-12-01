import { IDBDeviceBinding, IDeviceBinding, INamedEntity, NewDeviceBinding } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';
import { asyncFilter, extraPredicate } from '../utils/helpers';

import { deviceStates } from '../utils/constants';

import { getDb } from './dao/db';

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @param {string} userId - идентификатор пользователя
 * @return id, идентификатор устройства
 * */

const addOne = async (deviceBinding: NewDeviceBinding): Promise<IDeviceBinding> => {
  const db = getDb();
  const { deviceBindings, users, devices } = db;

  const user = await users.find(deviceBinding.user.id);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  const device = await devices.find(deviceBinding.device.id);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  if (await deviceBindings.find((i) => i.deviceId === deviceBinding.device.id && i.userId === deviceBinding.user.id)) {
    throw new ConflictException('Данное устройство уже добавлено пользователю');
  }

  const newDeviceBinding: IDBDeviceBinding = {
    id: '',
    state: deviceBinding.state,
    deviceId: deviceBinding.device.id,
    userId: deviceBinding.user.id,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  console.log('newDeviceBinding', newDeviceBinding);

  const createdDeviceBinding = await deviceBindings.find(await deviceBindings.insert(newDeviceBinding));
  console.log('createdDeviceBinding', createdDeviceBinding);

  return makeDeviceBinding(createdDeviceBinding);
};

/**
 * Обновляет связь с устройством
 * @param {IDBDevice} deviceBindingId - устройство
 * @return обновленную связь
 * */
const updateOne = async (id: string, deviceBindingData: Partial<IDeviceBinding>) => {
  //, params?: Record<string, string>
  const { deviceBindings } = getDb();

  const oldDeviceBinding = await deviceBindings.find(id);

  if (!oldDeviceBinding) {
    throw new DataNotFoundException('Связь с устройством не найдена');
  }

  // const deviceId = deviceBindingData.device
  //   ? (await devices.find(deviceBindingData.device.id))?.id
  //   : oldDeviceBinding.deviceId;

  // if (params) {
  //   if ('companyId' in params) {
  //     const device = await devices.find(deviceId);

  //     if (device.companyId !== params.companyID) {
  //       throw new DataNotFoundException('Устройство не может быть обновлено');
  //     }
  //   }
  // }

  //TODO добавить проверку, что пользователь из компании

  const newDeviceBinding: IDBDeviceBinding = {
    id,
    userId: deviceBindingData.user?.id || oldDeviceBinding.userId,
    state: deviceBindingData.state || oldDeviceBinding.state,
    deviceId: deviceBindingData.device?.id || oldDeviceBinding.deviceId,
    creationDate: deviceBindingData.creationDate,
    editionDate: new Date().toISOString(),
  };

  await deviceBindings.update(newDeviceBinding);

  const updatedDeviceBinding = await deviceBindings.find(id);

  return makeDeviceBinding(updatedDeviceBinding);
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = async ({ deviceBindingId }: { deviceBindingId: string }): Promise<void> => {
  const db = getDb();
  const { deviceBindings } = db;

  if (!(await deviceBindings.find((d) => d.id === deviceBindingId))) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  await deviceBindings.delete((d) => d.id === deviceBindingId);
};

const findOne = async (id: string): Promise<IDeviceBinding | undefined> => {
  const { deviceBindings } = getDb();

  const deviceBinding = await deviceBindings.find(id);

  if (!deviceBinding) {
    throw new DataNotFoundException('Связь с устройством не определена');
  }

  return makeDeviceBinding(deviceBinding);
};

const findAll = async (params?: Record<string, string>): Promise<IDeviceBinding[]> => {
  const { deviceBindings, devices, users } = getDb();

  let deviceBindingList = await deviceBindings.read((item) => {
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
    deviceBindingList = await asyncFilter(deviceBindingList, async (i: IDBDeviceBinding) => {
      const newParams = { ...params };

      const device = await devices.find(i.deviceId);

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
          const deviceName = device.name.toUpperCase();
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

  const pr = deviceBindingList.map(async (i) => await makeDeviceBinding(i));

  return Promise.all(pr);
};

export const makeDeviceBinding = async (deviceBinding: IDBDeviceBinding): Promise<IDeviceBinding> => {
  const db = getDb();
  const { users, devices } = db;

  const user = await users.find(deviceBinding?.userId);

  const userEntity: INamedEntity = user && { id: user.id, name: user.name };

  const device = await devices.find(deviceBinding?.deviceId);

  const deviceEntity: INamedEntity = device && { id: device.id, name: device.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: deviceBinding.id,
    user: userEntity,
    device: deviceEntity,
    state: deviceBinding.state,
    creationDate: deviceBinding.creationDate,
    editionDate: deviceBinding.editionDate,
  };
};

export { addOne, updateOne, deleteOne, findOne, findAll };
