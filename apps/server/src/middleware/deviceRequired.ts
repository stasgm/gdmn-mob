import { Context, Next } from 'koa';

import { devices } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  console.log('deviceId', ctx.header.deviceid);

  if (!ctx.query.deviceId) {
    ctx.throw(400, 'Не указан идентификатор устройства');
  }

  const currDevice = await devices.find((device) => device.uid === ctx.query.deviceId);

  if (!currDevice) {
    ctx.throw(400, 'Устройство не найдено');
  }

  await next();
};
