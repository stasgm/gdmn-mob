import { IDBDevice, IDevice, INamedEntity, NewDevice } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { deviceStates } from '../utils/constants';

import { getDb } from './dao/db';

import { devices as mockDevices } from './data/devices';

/**
 * Добавляет одно устройство
 * @param {string} name - название устройства
 * @param {string} companyId - идентификатор компании
 * @return устройство
 * */

const addOne = async (device: NewDevice): Promise<IDevice> => {
  const { devices } = getDb();

  if (await devices.find((i) => i.name === device.name && i.companyId === device.company?.id)) {
    throw new ConflictException(`Устройство с наименование ${device.name} уже сущеcтвует`);
  }

  const newDevice: IDBDevice = {
    id: '',
    name: device.name,
    uid: '',
    state: device.state || 'NON-REGISTERED',
    companyId: device.company?.id,
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
  console.log('update', id);
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
    creationDate: oldDevice.creationDate,
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
  const { devices, codes, deviceBindings } = getDb();

  if (!(await devices.find((device) => device.id === deviceId))) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  await devices.delete((device) => device.id === deviceId);
  await deviceBindings.delete((deviceBinding) => deviceBinding.deviceId === deviceId);
  await codes.delete((activationCode) => activationCode.deviceId === deviceId);
};

const findOne = async (id: string): Promise<IDevice | undefined> => {
  const { devices } = getDb();

  const device = await devices.find(id);

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

const findAll = async (params: Record<string, string | number>): Promise<IDevice[]> => {
  const { devices } = getDb();

  let deviceList;
  if (process.env.MOCK) {
    deviceList = mockDevices;
  } else {
    deviceList = await devices.read();
  }

  deviceList = deviceList.filter((item) => {
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

  /*   const newParams = { ...params };

    if ('adminId' in newParams) {
      deviceList = await asyncFilter(deviceList, async (i: IDBDevice) => {
        const company = await companies.find(i.companyId);
        return company?.adminId === newParams.adminId;
      });
    } */

  /** pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams) {
    fromRecord = limitParams.fromRecord as number;
  }

  let toRecord = deviceList.length;
  if ('toRecord' in limitParams)
    toRecord = (limitParams.toRecord as number) > 0 ? (limitParams.toRecord as number) : toRecord;

  const pr = deviceList.slice(fromRecord, toRecord).map(async (i) => await makeDevice(i));

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

export { addOne, updateOne, deleteOne, findOne, findOneByUid, findAll };
