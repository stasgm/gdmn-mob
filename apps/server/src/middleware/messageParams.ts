import { Context, Next } from 'koa';
import { NewMessage } from '@lib/types';

import { getDb } from '../services/dao/db';
import { InvalidParameterException } from '../exceptions';

export const messageParamsMiddlware = async (ctx: Context, next: Next): Promise<void> => {
  const body = ctx.request.body as NewMessage;
  const consumer = body.head?.consumer;

  if (consumer.id === '-1') {
    const db = getDb();
    const user = await db.users.find((u) => u.alias === consumer.name);

    if (!user) {
      throw new InvalidParameterException('Системный пользователь не определен');
    }

    ctx.request.body = { ...body, head: { ...body.head, consumer: user } };
  }

  await next();
};
