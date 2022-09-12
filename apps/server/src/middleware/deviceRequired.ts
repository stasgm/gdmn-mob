import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { InvalidParameterException, UnauthorizedException } from '../exceptions';
import { getDb } from '../services/dao/db';

export const deviceMiddleware = async (ctx: Context, next: Next) => {
  // Проверяем идентификатор только у пользователей с правами User
  const user = ctx.state.user as IUser;

  // if (!user) {
  //   throw new UnauthorizedException('Не пройдена аутентификация');
  // }

  if (user?.role === 'User') {
    const deviceId = ctx.query.deviceId;

    if (!deviceId) {
      throw new InvalidParameterException('Не указан идентификатор устройства');
    }

    const device = getDb().devices.data.find((el: any) => el.uid === deviceId);

    if (!device) {
      throw new UnauthorizedException('Устройство не найдено');
    }

    if (device.state === 'BLOCKED') {
      throw new UnauthorizedException('Устройство заблокировано');
    }

    const deviceBinding = getDb().deviceBindings.data.find(
      (el: any) => el.deviceId === device.id && el.userId === user.id,
    );

    if (!deviceBinding) {
      throw new UnauthorizedException('Связанное устройство не найдено');
    }

    if (deviceBinding.state === 'BLOCKED') {
      throw new UnauthorizedException('Связанное устройство заблокировано');
    }
  }

  await next();
};
