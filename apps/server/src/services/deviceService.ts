import { IDBDevice, IDevice, INamedEntity, NewDevice } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

const db = getDb();

const { devices, codes, users } = db;

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @param {string} userId - идентификатор пользователя
 * @return id, идентификатор устройства
 * */

const addOne = async (device: NewDevice): Promise<IDevice> => {
  if (await devices.find((i) => i.name === device.userId && i.userId === device.userId)) {
    throw new Error('устройство с таким названием уже добавлено пользователю');
  }

  const newDevice: IDBDevice = {
    id: '',
    name: device.name,
    uid: '',
    state: 'NEW',
    userId: device.userId,
  };

  const createdDevice = await devices.find(await devices.insert(newDevice));

  return makeDevice(createdDevice);
};

/**
 * Обновляет устройство
 * @param {IDBDevice} device - устройство
 * @return uid, идентификатор устройства
 * */
const updateOne = async (deviceId: string, deviceData: Partial<IDevice>) => {
  const oldDevice = await devices.find(deviceId);

  if (!oldDevice) {
    throw new Error('устройство не найдено');
  }

  // Проверяем есть ли в базе переданный пользователь
  const userId = deviceData?.user ? (await users.find(deviceData.user.id))?.id : oldDevice.userId;

  const newDevice: IDBDevice = {
    id: deviceId,
    name: deviceData.name || oldDevice.name,
    state: deviceData.state || oldDevice.state,
    uid: deviceData.uid || oldDevice.uid,
    userId,
  };

  await devices.update(newDevice);

  const updatedDevice = await devices.find(deviceId);

  return makeDevice(updatedDevice);
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = async ({ deviceId }: { deviceId: string }): Promise<void> => {
  if (!(await devices.find((device) => device.id === deviceId))) {
    throw new Error('устройство не найдено');
  }

  await devices.delete((device) => device.id === deviceId);
};

const genActivationCode = async (deviceId: string) => {
  const device = await devices.find(deviceId);

  if (!device) {
    throw new Error('устройство не найдено');
  }

  // const code = Math.random()
  //   .toString(36)
  //   .substr(3, 6);
  const code = `${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date();
  await codes.insert({ code, date: date.toISOString(), deviceId });

  await devices.update({ ...device, state: 'NON-ACTIVATED' });

  return code;
};

const findOne = async (id: string): Promise<IDevice | undefined> => {
  const device = await devices.find(id);

  if (!device) return;

  return makeDevice(device);
};

const findOneByUid = async (uid: string) => {
  const device = await devices.find((i) => i.uid === uid);

  if (!device) return;

  return makeDevice(device);
};

const findAll = async (params?: Record<string, string>): Promise<IDevice[]> => {
  const deviceList = await devices.read((item) => {
    const newParams = { ...params };

    let userFound = true;

    if ('userId' in newParams) {
      userFound = item.userId?.includes(newParams.userId);
      delete newParams['userId'];
    }

    return userFound && extraPredicate(item, newParams);
  });

  const pr = deviceList.map(async (i) => await makeDevice(i));

  return Promise.all(pr);
};

/**
 * Возвращает список пользователей по устройству
 * @param {string} id - идентификатор устройства
 * */
const findUsers = async (deviceId: string) => {
  if (!(await devices.find(deviceId))) {
    throw new Error('устройство не найдено');
  }

  return Promise.all(
    (await devices.read())
      .filter((i) => i.uid === deviceId)
      .map(async (i) => {
        const device = await devices.find(deviceId);

        if (!device) {
          throw new Error('устройство не найдено');
        }

        const user = await users.find(i.userId);

        if (!user) {
          throw new Error('пользователь не найден');
        }

        return await makeDevice(i);
      }),
  );
};

// const findOneByUidAndUser = async ({ deviceId, name }: { deviceId: string; name: string }) => {
//   const user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());

//   if (!user) {
//     throw new Error('Пользователь не найден');
//   }

//   return makeDevice(await devices.find((i) => i.uid === deviceId && i.userId === user.id));
// };

export const makeDevice = async (device: IDBDevice): Promise<IDevice> => {
  const user = await users.find(device?.userId);

  const userEntity: INamedEntity = user && { id: user.id, name: user.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: device.id,
    name: device.name,
    user: userEntity,
    state: device.state,
    uid: device.uid,
  };
};

export { addOne, updateOne, deleteOne, findOne, findOneByUid, findAll, findUsers, genActivationCode };
