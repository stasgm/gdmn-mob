import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { ForbiddenException } from '../exceptions';

export const superAdminMiddleware = async (ctx: Context, next: Next) => {
  if ((ctx.state.user as IUser).role !== 'SuperAdmin') {
    throw new ForbiddenException('Нет прав на операцию');
  }

  await next();
};
