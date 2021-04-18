import { Context, Next } from 'koa';

import { devices } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.query.deviceId === 'WEB') {
    await next();
    return;
  }

  if (!ctx.query.deviceId) {
    ctx.throw(400, 'ID устройства не указано');
  }

  if (ctx.query.deviceId instanceof Array) {
    ctx.throw(400, 'ID устройства должно быть строкой');
  }

  const device = await devices.find(ctx.query.deviceId);

  if (!device) {
    ctx.throw(400, 'Устройство не найдено');
  }

  const currDevice = await devices.find((i) => i.uid === device.id && i.userId === ctx.state.user.id);

  if (!currDevice) {
    ctx.throw(400, 'Устройство для пользователя не найдено');
  }

  if (currDevice.state !== 'ACTIVE') {
    ctx.throw(400, 'Устройство заблокировано');
  }

  await next();
};
