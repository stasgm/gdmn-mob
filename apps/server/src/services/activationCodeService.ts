import { IActivationCode, IDBActivationCode } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

/**
 * Возвращает множество кодов по указанным параметрам
 * @param params параметры
 * @returns Массив объектов кодов
 */
const findAll = (params?: Record<string, string>): IActivationCode[] => {
  const activationCodesList = getDb().codes.data.filter((item) => {
    const newParams = { ...params };

    let deviceFound = true;

    if ('deviceId' in newParams) {
      deviceFound = item.deviceId?.includes(newParams.deviceId);
      delete newParams['deviceId'];
    }

    return deviceFound && extraPredicate(item, newParams);
  });

  return activationCodesList.map((i) => makeCode(i));
};

/**
 * Формирует новый код для устройства
 * @param deviceId ИД устройства
 * @returns Объект кода
 */
const genActivationCode = (deviceId: string): IActivationCode => {
  const { devices, codes, deviceBindings } = getDb();

  const device = devices.findById(deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  //Удаляем все коды по устройству
  codes.data.filter((code) => code.deviceId === deviceId)?.forEach((code) => codes.deleteById(code.id));

  const code = `${Math.floor(1000 + Math.random() * 9000)}`;

  const newCodeObj = {
    code,
    date: new Date().toISOString(),
    deviceId,
  } as IDBActivationCode;

  const newCode = codes.insert(newCodeObj);

  //Устанавливаем состояние данного устройства в 'NON-ACTIVATED'
  devices.update({ ...device, state: 'NON-ACTIVATED' });

  //Устанавливаем состояние привязанных устройств данного устройства в 'NON-ACTIVATED'
  deviceBindings.data
    .filter((binding) => binding.deviceId === deviceId)
    ?.forEach((binding) => deviceBindings.update({ ...binding, state: 'NON-ACTIVATED' }));

  return makeCode(newCode);
};

export const makeCode = (activationCode: IDBActivationCode): IActivationCode => {
  const device = getDb().devices.findById(activationCode.deviceId);

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    code: activationCode.code,
    date: activationCode.date,
    device,
    id: activationCode.id,
  };
};

export { findAll, genActivationCode };
