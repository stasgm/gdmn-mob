import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

import { UnauthorizedException } from '../exceptions';

export const appSystemMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if ((ctx.state.user as IUser).role !== 'SuperAdmin') {
    throw new UnauthorizedException('Нет прав на операцию');
  }

  await next();
};
