import { Context, Next } from 'koa';

import { UnauthorizedException } from '../exceptions';

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.state.user) {
    await next();
  }

  throw new UnauthorizedException('Не пройдена аутентификация');
};
