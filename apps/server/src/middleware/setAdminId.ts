import { IUser } from '@lib/types';
import { Context, Next } from 'koa';

export const setAdminIdMiddleware = async (ctx: Context, next: Next) => {
  const user = ctx.state.user as IUser;

  if (user?.role !== 'SuperAdmin') {
    ctx.request.query.adminId = user.id;
  }

  await next();
};
