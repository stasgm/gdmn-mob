import { Context, Next } from 'koa';

import { UnauthorizedException } from '../exceptions';

export const authMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.user) {
    throw new UnauthorizedException('Не пройдена аутентификация');
  }

  next();
};
