import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { InvalidParameterException, UnauthorizedException } from '../exceptions';
import { getDb } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  // Проверяем идентификатор только у пользователей с правами User
  const user = ctx.state.user as IUser;

  if (!user) {
    throw new UnauthorizedException('Неверные данные');
  }

  if (user?.role === 'User') {
    const { deviceId } = ctx.query;
    if (!deviceId) {
      throw new InvalidParameterException('Не указан идентификатор устройства');
    }

    const { devices, deviceBindings } = getDb();

    const device = await devices.find((el) => el.uid === deviceId);
    if (!device) {
      throw new UnauthorizedException('Устройство не найдено');
    }

    if (device.state === 'BLOCKED') {
      throw new UnauthorizedException('Устройство заблокировано');
    }

    const deviceBinding = await deviceBindings.find((el) => el.deviceId === deviceId && el.userId === user.id);
    if (!deviceBinding) {
      throw new UnauthorizedException('Связанное с пользователем устройство не найдено');
    }

    if (deviceBinding.state === 'BLOCKED') {
      throw new UnauthorizedException('Связанное с пользователем устройство заблокировано');
    }
  }

  await next();
};
