import { Context, Next } from 'koa';

import { IResponse } from '@lib/types';

import log from '../utils/logger';

const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const result: IResponse<string> = {
      result: false,
      error: error.name,
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

/*
export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { result: false, error: err.message };

    switch (true) {
      case ctx.status >= 400 && ctx.status < 500:
        ctx.app.emit('user-error', err, ctx);
        break;
      case ctx.status >= 500:
        ctx.app.emit('error', err, ctx);
        break;
      default:
        ctx.app.emit('error', err, ctx);
    }
  }
};
 */
