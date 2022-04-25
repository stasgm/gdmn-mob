import { IAppSystem } from '@lib/types';

// import { DataNotFoundException } from '../exceptions';

// import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

const findAll = async (params?: Record<string, string>): Promise<IAppSystem[]> => {
  const { appSystems } = getDb();

  const appSystemsList = await appSystems.read();

  return Promise.all(appSystemsList);
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
