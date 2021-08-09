import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

export const roleBasedParamsMiddlware = async (ctx: Context, next: Next): Promise<void> => {
  const user = ctx.state.user as IUser;

  if (user?.role !== 'SuperAdmin') {
    if (user?.role === 'Admin' && !user.company) {
      ctx.request.query.companyId = '-1';
    } else {
      ctx.request.query.companyId = user.company?.id;
    }
  }

  await next();
};
