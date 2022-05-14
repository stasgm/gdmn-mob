import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { UnauthorizedException } from '../exceptions';

export const permissionMiddleware = async (ctx: Context, next: Next) => {
  if ((ctx.state.user as IUser)?.role === 'User') {
    // TODO сделать гибкую систему прав
    throw new UnauthorizedException('Нет прав на операцию');
  }

  await next();
};
