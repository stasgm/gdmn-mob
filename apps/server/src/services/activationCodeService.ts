import { IDBDevice, IDevice, INamedEntity, NewDevice, IActivationCode, IDBActivationCode } from '@lib/types';
import { activationCodeService } from '.';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { getDb } from './dao/db';

const findAll = async (params?: Record<string, string>): Promise<IActivationCode[]> => {
  const db = getDb();
  const { codes } = getDb();

  const activationCodesList = await codes.read((item) => {
    const newParams = { ...params };

    let deviceFound = true;

    if ('deviceId' in newParams) {
      deviceFound = item.deviceId?.includes(newParams.deviceId);
      delete newParams['deviceId'];
    }

    return deviceFound && extraPredicate(item, newParams);
  });

  const pr = activationCodesList.map(async (i) => await makeCode(i));

  return Promise.all(pr);
};

export const makeCode = async (activationCode: IDBActivationCode): Promise<IActivationCode> => {
  const db = getDb();
  const { devices, codes } = db;

  const device = await devices.find(activationCode.deviceId);

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    code: activationCode.code,
    date: activationCode.date,
    device,
    id: activationCode.id,
  };
};

export { findAll };
