import { Context, Next } from 'koa';

import { IResponse } from '@lib/types';

import log from '../utils/logger';
import { ApplicationException } from '../exceptions';

const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ApplicationException) {
      const result: IResponse<string> = {
        result: false,
        error: error.message || 'unknown error',
        data: error.name || 'InnerErrorException',
      };

      ctx.status = error.status || 500;
      ctx.body = result;

      log.error(error.toString());
    }
  }
};

export { errorHandler };
