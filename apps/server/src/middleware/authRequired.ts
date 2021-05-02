import { Context, Next } from 'koa';

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if (!ctx.state.user) {
    ctx.throw(401, 'Не пройдена аутентификация');
  }
  await next();
};
