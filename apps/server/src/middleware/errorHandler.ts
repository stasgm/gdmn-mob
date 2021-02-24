import { Context, Next } from 'koa';

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
