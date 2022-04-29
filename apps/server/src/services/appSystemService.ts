import { IAppSystem } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { appSystems as mockAppSystems } from './data/appSystems';

import { getDb } from './dao/db';

const findAll = async (params: Record<string, string | number>): Promise<IAppSystem[]> => {
  const { appSystems } = getDb();

  let appSystemList;
  if (process.env.MOCK) {
    appSystemList = mockAppSystems;
  } else {
    appSystemList = await appSystems.read();
  }

  appSystemList = appSystemList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    /** filtering data */
    let filteredAppSystems = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const creationDate = new Date(item.creationDate || '').toLocaleString('ru', { hour12: false });
        const editionDate = new Date(item.editionDate || '').toLocaleString('ru', { hour12: false });

        filteredAppSystems =
          name.includes(filterText) || creationDate.includes(filterText) || editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return filteredAppSystems && extraPredicate(item, newParams as Record<string, string>);
  });

  /** pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams) {
    fromRecord = limitParams.fromRecord as number;
  }

  let toRecord = appSystemList.length;
  if ('toRecord' in limitParams)
    toRecord = (limitParams.toRecord as number) > 0 ? (limitParams.toRecord as number) : toRecord;

  return appSystemList.slice(fromRecord, toRecord);
};

// const genActivationCode = async (deviceId: string) => {
//   const { devices, codes, deviceBindings } = getDb();

//   const device = await devices.find(deviceId);

//   const deviceBinding = await deviceBindings.read((deviceBinding) => deviceBinding.deviceId === deviceId);

//   if (!device) {
//     throw new DataNotFoundException('Устройство не найдено');
//   }

//   await codes.delete((activationCode) => activationCode.deviceId === deviceId);

//   // const code = Math.random()
//   //   .toString(36)
//   //   .substr(3, 6);
//   const code = `${Math.floor(1000 + Math.random() * 9000)}`;

//   const newCodeObj = {
//     code,
//     date: new Date().toISOString(),
//     deviceId,
//   } as IDBActivationCode;

//   const newCode = await codes.insert(newCodeObj);

//   const createdCode = await codes.find(newCode);

//   await devices.update({ ...device, state: 'NON-ACTIVATED' });

//   const updateDeviceBindings = async (deviceBindingList: IDBDeviceBinding[]) => {
//     for (const item of deviceBindingList) {
//       await deviceBindings.update({ ...item, state: 'NON-ACTIVATED' });
//     }
//   };
//   updateDeviceBindings(deviceBinding);

//   const retCode = await makeCode(createdCode);

//   return retCode;
// };

// export const makeCode = async (activationCode: IDBActivationCode): Promise<IActivationCode> => {
//   const db = getDb();
//   const { devices } = db;

//   const device = await devices.find(activationCode.deviceId);

//   /* TODO В звависимости от прав возвращать разный набор полей */
//   return {
//     code: activationCode.code,
//     date: activationCode.date,
//     device,
//     id: activationCode.id,
//   };
// };

// export { findAll, genActivationCode };

export { findAll };
