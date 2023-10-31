import { Context, Next } from 'koa';

import { UnauthorizedException } from '../exceptions';

export const adminMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.user.creator) {
    throw new UnauthorizedException(`Не определен администратор пользователя ${ctx.state.user.name}`);
  }

  await next();
};
