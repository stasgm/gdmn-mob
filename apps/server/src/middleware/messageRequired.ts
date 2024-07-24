import { Context, Next } from 'koa';

import { DataNotFoundException, InvalidParameterException } from '../exceptions';

import { getDb } from '../services/dao/db';

export const messageMiddleware = async (ctx: Context, next: Next) => {
  const { companies, appSystems } = getDb();
  const { companyId, appSystemId } = ctx.query;

  if (companyId instanceof Array || !companyId) {
    throw new InvalidParameterException('Компания должна быть строкой');
  }

  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (appSystemId instanceof Array || !appSystemId) {
    throw new InvalidParameterException('Подсистема должна быть строкой');
  }

  const appSystem = appSystems.findById(appSystemId);
  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  ctx.query.appSystemName = appSystem.name;

  await next();
};
