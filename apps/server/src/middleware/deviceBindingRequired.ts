import { Context, Next } from 'koa';

import { DataNotFoundException, InvalidParameterException, UnauthorizedException } from '../exceptions';

import { getDb } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  if (ctx.query.deviceId === 'WEB') {
    return await next();
  }

  if (!ctx.query.deviceId) {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  if (ctx.query.deviceId instanceof Array) {
    throw new InvalidParameterException('Устройство должно быть строкой');
  }

  const db = getDb();

  const device = await db.devices.find(ctx.query.deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  //TODO перенести в службу
  const currDevice = await db.devices.find((i) => i.uid === device.id && i.userId === ctx.state.user?.id);

  if (!currDevice) {
    throw new DataNotFoundException('Не указано имя пользователя');
  }

  if (currDevice.state !== 'ACTIVE') {
    throw new UnauthorizedException('Не указано имя пользователя');
  }

  await next();
};
