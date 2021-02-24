import { IDevice } from '../../../common';
import { devices, codes, users } from './dao/db';

const findOne = async (id: string) => {
  return devices.find(id);
};

const findAll = async () => {
  return devices.read();
};

const findOneByUidAndUser = async ({ deviceId, userName }: { deviceId: string; userName: string }) => {
  const user = await users.find(i => i.userName.toUpperCase() === userName.toUpperCase());

  if (!user) {
    throw new Error('пользователь не найден');
  }

  return devices.find(i => i.uid === deviceId && i.userId === user.id);
};

const findOneByUid = async (uid: string) => {
  return devices.find(i => i.uid === uid);
};

/**
 * Возвращает список пользователей по устройству
 * @param {string} id - идентификатор устройства
 * */
const findUsers = async (deviceId: string) => {
  if (!(await devices.find(deviceId))) {
    throw new Error('устройство не найдено');
  }

  return (await devices.read())
    .filter(i => i.uid === deviceId)
    .map(async i => {
      const device = await devices.find(deviceId);

      if (!device) {
        throw new Error('устройство не найдено');
      }

      const user = await users.find(i.userId);

      if (!user) {
        throw new Error('пользователь не найден');
      }

      return {
        id: i.id,
        userId: i.userId,
        userName: user.userName,
        deviceId: i.uid,
        deviceName: device.name,
        state: i.state,
      };
    });
};

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @param {string} userId - идентификатор пользователя
 * @return id, идентификатор устройства
 * */

const addOne = async ({ deviceName, userId }: { deviceName: string; userId: string }) => {
  if (await devices.find(device => device.name === deviceName && device.userId === userId)) {
    throw new Error('устройство с таким названием уже добавлено пользователю');
  }

  return await devices.insert({ name: deviceName, uid: '', state: 'NEW', userId: userId });
};

/**
 * Обновляет устройство
 * @param {IDevice} device - устройство
 * @return uid, идентификатор устройства
 * */
const updateOne = async (device: IDevice) => {
  await devices.update(device);

  return device.uid;
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = async ({ deviceId }: { deviceId: string }): Promise<void> => {
  if (!(await devices.find(device => device.id === deviceId))) {
    throw new Error('устройство не найдено');
  }

  await devices.delete(device => device.id === deviceId);
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

export {
  findOne,
  findAll,
  findUsers,
  addOne,
  deleteOne,
  updateOne,
  findOneByUidAndUser,
  findOneByUid,
  genActivationCode,
};
