import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { ForbiddenException } from '../exceptions';

export const permissionMiddleware = async (ctx: Context, next: Next) => {
  if ((ctx.state.user as IUser)?.role === 'User') {
    // TODO сделать гибкую систему прав
    throw new ForbiddenException('Нет прав на операцию');
  }

  await next();
};
