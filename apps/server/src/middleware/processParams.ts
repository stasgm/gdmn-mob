import { Context, Next } from 'koa';
import { AddProcessRequest } from '@lib/types';

export const processParamsMiddlware = async (ctx: Context, next: Next) => {
  const body = ctx.request.body as AddProcessRequest;
  const userId = ctx.state.user.id;

  ctx.request.body = { ...body, consumerId: userId };

  await next();
};
