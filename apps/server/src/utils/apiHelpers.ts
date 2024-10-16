import { SuccessResponse } from '@lib/types';
import { Context } from 'koa';

import log from '../utils/logger';

export const ok = <T>(ctx: Context, data?: T, logMessage?: string, logData?: boolean) => {
  ctx.statusMessage = 'success result';
  ctx.status = 200;
  ctx.body = {
    result: true,
    type: 'SUCCESS',
    status: 200,
    data,
  } as SuccessResponse<T>;
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
    type: 'SUCCESS',
    status: 201,
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
  ctx.status = 400;
  ctx.body = {
    result: false,
    type: 'FAILURE',
    status: 400,
  };
};

export const serverInnerError = (ctx: Context) => {
  ctx.status = 500;
  ctx.body = {
    result: false,
    type: 'FAILURE',
    status: 500,
  };
};
