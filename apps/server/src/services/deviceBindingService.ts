import { IDBDeviceBinding, IDeviceBinding, INamedEntity, NewDeviceBinding } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';
import { asyncFilter, extraPredicate } from '../utils/helpers';

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
    state: 'NEW',
    deviceId: deviceBinding.device.id,
    userId: deviceBinding.user.id,
  };

  const createdDeviceBinding = await deviceBindings.find(await deviceBindings.insert(newDeviceBinding));

  return makeDeviceBinding(createdDeviceBinding);
};

/**
 * Обновляет связь с устройством
 * @param {IDBDevice} deviceBindingId - устройство
 * @return обновленную связь
 * */
const updateOne = async (id: string, deviceBindingData: Partial<IDeviceBinding>, params?: Record<string, string>) => {
  const { deviceBindings, companies, devices } = getDb();

  const oldDeviceBinding = await deviceBindings.find(id);

  if (!oldDeviceBinding) {
    throw new DataNotFoundException('Связь с устройством не найдена');
  }

  const deviceId = deviceBindingData.device
    ? (await companies.find(deviceBindingData.device.id))?.id
    : oldDeviceBinding.deviceId;

  if (params) {
    if ('companyId' in params) {
      const device = await devices.find(deviceId);

      if (device.companyId !== params.companyID) {
        throw new DataNotFoundException('Устройство не может быть обновлено');
      }
    }
  }

  //TODO добавить проверку, что пользователь из компании

  const newDeviceBinding: IDBDeviceBinding = {
    id,
    userId: deviceBindingData.user?.id || oldDeviceBinding.userId,
    state: deviceBindingData.state || oldDeviceBinding.state,
    deviceId: deviceBindingData.device?.id || oldDeviceBinding.deviceId,
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
  const { deviceBindings, devices } = getDb();

  let deviceBindingList = await deviceBindings.read((item) => {
    const newParams = { ...params };

    let userFound = true;

    if ('userId' in newParams) {
      userFound = item.userId?.includes(newParams.userId);
      delete newParams['userId'];
    }

    let deviceFound = true;

    if ('deviceId' in newParams) {
      deviceFound = item.userId?.includes(newParams.deviceId);
      delete newParams['deviceId'];
    }

    let stateFound = true;

    if ('state' in newParams) {
      stateFound = item.state === newParams.state;
      delete newParams['state'];
    }

    return userFound && deviceFound && stateFound && extraPredicate(item, newParams);
  });

  const newParams = { ...params };

  if ('companyId' in newParams) {
    deviceBindingList = await asyncFilter(deviceBindingList, async (i: IDBDeviceBinding) => {
      const device = await devices.find(i.deviceId);
      return device?.companyId === newParams.companyId;
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

  const device = await devices.find(deviceBinding?.userId);

  const deviceEntity: INamedEntity = device && { id: device.id, name: device.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: deviceBinding.id,
    user: userEntity,
    device: deviceEntity,
    state: deviceBinding.state,
  };
};

export { addOne, updateOne, deleteOne, findOne, findAll };
