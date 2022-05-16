import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { DataNotFoundException, InvalidParameterException } from '../exceptions';

import { getDb } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  const user = ctx.state.user as IUser;

  if (user?.role === 'User') {
    if (!ctx.query.deviceId) {
      throw new InvalidParameterException('Не указан идентификатор устройства');
    }

    if (ctx.query.deviceId instanceof Array) {
      throw new InvalidParameterException('Устройство должно быть строкой');
    }

    const device = getDb().devices.findById(ctx.query.deviceId);

    if (!device) {
      throw new DataNotFoundException('Устройство не найдено');
    }
  }

  await next();
};
