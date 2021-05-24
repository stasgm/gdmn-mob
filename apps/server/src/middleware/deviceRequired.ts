import { Context, Next } from 'koa';

import { DataNotFoundException, InvalidParameterException } from '../exceptions';
import { entities } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.query.deviceId) {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  const currDevice = await entities.devices.find((device) => device.uid === ctx.query.deviceId);

  if (!currDevice) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  await next();
};
