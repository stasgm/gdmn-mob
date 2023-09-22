import { Context, Next } from 'koa';

import { FailureResponse } from '@lib/types';

import log from '../utils/logger';
import { ApplicationException } from '../exceptions';
import { getDb } from '../services/dao/db';

export const errorHandler = async (ctx: Context, next: Next) => {
  const { pendingWrites } = getDb();

  try {
    await pendingWrites();
    await next();
  } catch (error: any) {
    const userInfo = ctx.state.user ? `\nuser '${ctx.state.user.name}' (${ctx.state.user.id})` : '';

    if (error instanceof ApplicationException) {
      const result: FailureResponse = {
        result: false,
        type: 'FAILURE',
        status: error.status || 500,
        error: error.message || 'Неизвестная внутренняя ошибка',
      };

      ctx.status = 200;
      ctx.body = result;
      log.error(`${error.toString()}${userInfo}`);
    } else {
      const errorMsg = error instanceof Error && error.message ? error.message : `Неизвестная ошибка: ${error}`;
      ctx.status = 500;
      ctx.body = {
        result: false,
        type: 'FAILURE',
        status: 500,
        error: errorMsg,
      };
      log.error(`${errorMsg}${userInfo}`, JSON.stringify(error));
    }
  }
};
