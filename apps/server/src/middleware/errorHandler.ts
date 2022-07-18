import { Context, Next } from 'koa';

import { IResponse } from '@lib/types';

import log from '../utils/logger';
import { ApplicationException } from '../exceptions';
import { getDb } from '../services/dao/db';

export const errorHandler = async (ctx: Context, next: Next) => {
  const { pendingWrites: waitPendingWrites } = getDb();

  try {
    await Promise.all([next(), waitPendingWrites()]);
  } catch (error) {
    if (error instanceof ApplicationException) {
      const result: IResponse<string> = {
        result: false,
        error: error.message || 'Неизвестная ошибка',
        data: error.name || 'InnerErrorException',
        status: error.status || 500,
      };

      ctx.status = 200;
      ctx.body = result;

      log.error(error.toString());
    } else {
      ctx.status = 500;
      ctx.body = {
        result: false,
        error: 'Неизвестная ошибка',
        data: 'InnerErrorException',
      };

      log.error('Неизвестная ошибка');
    }
  }
};
