import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { DataNotFoundException, InvalidParameterException } from '../exceptions';
import { getDb } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  // Проверяем идентификатор только у пользователей с правами User
  if ((ctx.state.user as IUser)?.role === 'User') {
    if (!ctx.query.deviceId) {
      throw new InvalidParameterException('Не указан идентификатор устройства');
    }

    const { devices } = getDb();

    const currDevice = await devices.find((device) => device.uid === ctx.query.deviceId);

    if (!currDevice) {
      throw new DataNotFoundException('Устройство не найдено');
    }
  }

  await next();
};
