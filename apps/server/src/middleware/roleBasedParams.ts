import { Context, Next } from 'koa';
import { IUser } from '@lib/types';

export const roleBasedParamsMiddlware = async (ctx: Context, next: Next): Promise<void> => {
  const user = ctx.state.user as IUser;

  if (user?.role !== 'SuperAdmin') {
    // Ограничиваем запрос организацией администратора системы
    // const { companyId } = ctx.request.query;

    // if (!companyId) {
    // ctx.request.query.companyId = user.company?.id;

    if (user?.role == 'Admin') {
      // console.log('1234');
      // console.log('1235', user);
      //user?.role != 'SuperAdmin';
      //ctx.request.query.user != 'SuperAdmin';
    }
    ctx.request.query.companyId = user.company?.id;
    // }
  }

  await next();
};
