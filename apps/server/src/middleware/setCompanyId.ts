import { IUser } from '@lib/types';
import { Context, Next } from 'koa';

export const setCompanyIdMiddleware = async (ctx: Context, next: Next) => {
  const user = ctx.state.user as IUser;

  if (user?.role !== 'SuperAdmin') {
    ctx.request.query.companyId = user?.role === 'Admin' && !user.company ? '-1' : user?.company?.id;
  }

  await next();
};
