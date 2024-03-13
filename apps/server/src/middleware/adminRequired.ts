import { IUser } from '@lib/types';
import { Context, Next } from 'koa';

import { ForbiddenException } from '../exceptions';

export const adminMiddleware = async (ctx: Context, next: Next) => {
  if ((ctx.state.user as IUser)?.role === 'User') {
    // TODO сделать гибкую систему прав
    throw new ForbiddenException('Нет прав на операцию');
  }

  await next();
};
