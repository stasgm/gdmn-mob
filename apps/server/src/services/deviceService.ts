import { IDBDevice, IDevice, INamedEntity, NewDevice } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @param {string} companyId - идентификатор компании
 * @return устройство
 * */

const addOne = async (device: NewDevice): Promise<IDevice> => {
  const { devices } = getDb();

  if (await devices.find((i) => i.name === device.name && i.companyId === device.company.id)) {
    throw new ConflictException(`Устройство с наименование ${device.name} уже сущеcтвует`);
  }

  const newDevice: IDBDevice = {
    id: '',
    name: device.name,
    uid: '',
    state: 'NON-REGISTERED',
    companyId: device.company.id,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  const createdDevice = await devices.find(await devices.insert(newDevice));

  return makeDevice(createdDevice);
};

/**
 * Обновляет устройство
 * @param {IDBDevice} device - устройство
 * @return обновленное устройство
 * */
const updateOne = async (id: string, deviceData: Partial<IDevice>, params?: Record<string, string>) => {
  const { devices, companies } = getDb();

  const oldDevice = await devices.find(id);

  if (!oldDevice) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  const companyId = deviceData.company ? (await companies.find(deviceData.company.id))?.id : oldDevice.companyId;

  if (params) {
    if ('adminId' in params) {
      const company = await companies.find((c) => c.id === companyId && c.adminId === params.adminId);
      if (!company) {
        throw new DataNotFoundException('Устройство не может быть отредактировано');
      }
    }
  }

  const newDevice: IDBDevice = {
    id,
    name: deviceData.name || oldDevice.name,
    state: deviceData.state || oldDevice.state,
    uid: deviceData.uid || oldDevice.uid,
    companyId,
    creationDate: deviceData.creationDate,
    editionDate: new Date().toISOString(),
  };

  await devices.update(newDevice);

  const updatedDevice = await devices.find(id);

  return makeDevice(updatedDevice);
};

/**
 * Удаляет одно устройство
 * @param {string} id - идентификатор устройства
 * */
const deleteOne = async ({ deviceId }: { deviceId: string }): Promise<void> => {
  const { devices } = getDb();

  if (!(await devices.find((device) => device.id === deviceId))) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  await devices.delete((device) => device.id === deviceId);
};

const genActivationCode = async (deviceId: string) => {
  const { devices, codes } = getDb();

  const device = await devices.find(deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
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
  const { devices } = getDb();

  //let device: IDBDevice | undefined;

  // if (id === 'WEB') {
  //   device = await devices.find((e) => e.uid === id);
  // } else {
  const device = await devices.find(id);
  //}

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  return makeDevice(device);
};

const findOneByUid = async (uid: string) => {
  const db = getDb();
  const { devices } = db;

  const device = await devices.find((i) => i.uid === uid);

  if (!device) return;

  return makeDevice(device);
};

const findAll = async (params?: Record<string, string>): Promise<IDevice[]> => {
  const { devices } = getDb();

  const deviceList = await devices.read((item) => {
    const newParams = { ...params };

    let companyFound = true;

    if ('companyId' in newParams) {
      companyFound = item.companyId?.includes(newParams.companyId);
      delete newParams['companyId'];
    }

    /*state и uId обработается в extraPredicate */
    // let uIdFound = true;

    // if ('uId' in newParams) {
    //   uIdFound = item.uid === newParams.uId;
    //   delete newParams['uId'];
    // }

    // let stateFound = true;

    // if ('state' in newParams) {
    //   stateFound = item.state === newParams.state;
    //   delete newParams['state'];
    // }

    return companyFound && extraPredicate(item, newParams);
  });

  /*   const newParams = { ...params };

    if ('adminId' in newParams) {
      deviceList = await asyncFilter(deviceList, async (i: IDBDevice) => {
        const company = await companies.find(i.companyId);
        return company?.adminId === newParams.adminId;
      });
    } */

  const pr = deviceList.map(async (i) => await makeDevice(i));

  return Promise.all(pr);
};

// /**
//  * Возвращает список пользователей по устройству
//  * @param {string} id - идентификатор устройства
//  * */
// const findUsers = async (deviceId: string) => {
//   const db = getDb();
//   const { devices, users, deviceBindings } = db;

//   if (!(await devices.find(deviceId))) {
//     throw new DataNotFoundException('Устройство не найдено');
//   }

//   return Promise.all(
//     (await deviceBindings.read())
//       .filter((i) => i.deviceId === deviceId)
//       .map(async (i) => {
//         const device = await devices.find(deviceId);

//         if (!device) {
//           throw new DataNotFoundException('Устройство не найдено');
//         }

//         const user = await users.find(i.userId);

//         if (!user) {
//           throw new DataNotFoundException('Пользователь не найден');
//         }

//         return await makeDevice(i);
//       }),
//   );
// };

// const findOneByUidAndUser = async ({ deviceId, name }: { deviceId: string; name: string }) => {
//   const user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());

//   if (!user) {
//     throw new Error('Пользователь не найден');
//   }

//   return makeDevice(await devices.find((i) => i.uid === deviceId && i.userId === user.id));
// };

export const makeDevice = async (device: IDBDevice): Promise<IDevice> => {
  const db = getDb();
  const { companies } = db;

  const company = await companies.find(device?.companyId);

  const companyEntity: INamedEntity = company && { id: company.id, name: company.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: device.id,
    name: device.name,
    company: companyEntity,
    state: device.state,
    uid: device.uid,
    creationDate: device.creationDate,
    editionDate: device.editionDate,
  };
};

export { addOne, updateOne, deleteOne, findOne, findAll, genActivationCode, findOneByUid };
