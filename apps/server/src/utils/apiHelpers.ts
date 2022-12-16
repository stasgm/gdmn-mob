import { Context } from 'koa';

import log from '../utils/logger';

export const ok = (ctx: Context, data?: any, logMessage?: string, logData?: boolean) => {
  ctx.statusMessage = 'success result';
  ctx.status = 200;
  ctx.body = {
    result: true,
    data,
  };
  if (logMessage) {
    if (logData) {
      log.info(logMessage, data);
    } else {
      log.info(logMessage);
    }
  }
};

export const created = (ctx: Context, data?: any, logMessage?: string, logData?: boolean) => {
  ctx.status = 201;
  ctx.body = {
    result: true,
    data,
  };
  if (logMessage) {
    if (logData) {
      log.info(logMessage, data);
    } else {
      log.info(logMessage);
    }
  }
};

export const notOk = (ctx: Context) => {
  ctx.status = 201;
  ctx.body = { result: false };
};
