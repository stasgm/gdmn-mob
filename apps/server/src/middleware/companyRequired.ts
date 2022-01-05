import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

export const companyMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const user = ctx.state.user as IUser;

  if (user?.role !== 'SuperAdmin') {
    ctx.request.query.adminId = user.id;
  }

  await next();
};
