import { IActivationCode, IDBActivationCode } from '@lib/types';

import { DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils';

import { getDb } from './dao/db';

/**
 * Создает новый код для устройства
 * @param deviceId ИД устройства
 * @returns Созданный объект кода
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

  const newCode = codes.insert({
    id: '',
    code,
    date: new Date().toISOString(),
    deviceId,
  });

  //Устанавливаем состояние данного устройства в 'NON-ACTIVATED'
  devices.update({ ...device, state: 'NON-ACTIVATED' });

  //Устанавливаем состояние привязанных устройств данного устройства в 'NON-ACTIVATED'
  deviceBindings.data
    .filter((binding) => binding.deviceId === deviceId)
    ?.forEach((binding) => deviceBindings.update({ ...binding, state: 'NON-ACTIVATED' }));

  return makeCode(newCode);
};

/**
 * Возвращает множество кодов по указанным параметрам
 * @param params Параметры поиска
 * @returns Массив найденных объектов кодов
 */
const findMany = (params?: Record<string, string>): IActivationCode[] => {
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
 * Возвращает объект кода с преобразованными полями-ссылками в INamedEntity
 * @param codeDBObj Объект кода типа IDBActivationCode
 * @returns Объект кода типа IActivationCode
 */
/* TODO В звависимости от прав возвращать разный набор полей */
export const makeCode = (codeDBObj: IDBActivationCode): IActivationCode => ({
  code: codeDBObj.code,
  date: codeDBObj.date,
  device: getDb().devices.getNamedItem(codeDBObj.deviceId),
  id: codeDBObj.id,
});

export { findMany, genActivationCode };
