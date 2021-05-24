import { Context, Next } from 'koa';

import { IResponse } from '@lib/types';

import log from '../utils/logger';

const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const result: IResponse<string> = {
      result: false,
      error: error.data,
      data: error.message || 'unknown error',
    };

    ctx.status = error.status || 500;
    ctx.body = result;
    /*
        switch (true) {
          case ctx.status >= 400 && ctx.status < 500:
            ctx.app.emit('user-error', error, ctx);
            break;
          case ctx.status >= 500:
            ctx.app.emit('error', error, ctx);
            break;
          default:
            ctx.app.emit('error', error, ctx);
        } */

    log.error(error.toString());
  }
};

export { errorHandler };
