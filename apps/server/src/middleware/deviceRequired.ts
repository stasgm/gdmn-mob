import { Context, Next } from 'koa';

import { DataNotFoundException } from '../exceptions';
import { InvalidParameterException } from '../exceptions/invalidparameter.exception';

import { entities } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  // console.log('deviceId', ctx.header.deviceid);

  if (!ctx.query.deviceId) {
    // ctx.throw(400, 'Не указан идентификатор устройства');
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }
  //TODO перенести в службу
  const currDevice = await entities.devices.find((device) => device.uid === ctx.query.deviceId);

  if (!currDevice) {
    // ctx.throw(400, 'Устройство не найдено');
    throw new DataNotFoundException('Устройство не найдено');
  }

  await next();
};
