import { Context, Next } from 'koa';

import { DataNotFoundException, InvalidParameterException, UnauthorizedException } from '../exceptions';

import { entities } from '../services/dao/db';

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

  const device = await entities.devices.find(ctx.query.deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  //TODO перенести в службу
  const currDevice = await entities.devices.find((i) => i.uid === device.id && i.userId === ctx.state.user.id);

  if (!currDevice) {
    // ctx.throw(400, 'Устройство для пользователя не найдено');
    throw new DataNotFoundException('Не указано имя пользователя');
  }

  if (currDevice.state !== 'ACTIVE') {
    // ctx.throw(400, 'Устройство заблокировано');
    throw new UnauthorizedException('Не указано имя пользователя');
  }

  await next();
};
