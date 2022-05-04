import { Context, ParameterizedContext } from 'koa';

import { NewMessage } from '@lib/types';

import log from '../utils/logger';
import { messageService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { ForbiddenException } from '../exceptions';

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const message = ctx.request.body as NewMessage;

  if (ctx.state.user.company.id !== message.head.company.id) {
    throw new ForbiddenException('Пользователь не входит в организацию указанную в заголовке сообщения');
  }

  const messageId = await messageService.addOne({
    msgObject: message,
    producerId: ctx.state.user.id,
    appSystem: message.head.appSystem,
    companyId: message.head.company.id,
  });

  const resultData = { uid: messageId, date: new Date() };
  created(ctx as Context, resultData);

  log.info('newMessage: message is successfully created');
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystem } = ctx.params;
  const userId = ctx.state.user.id;

  const messageList = await messageService.FindMany({
    appSystem,
    companyId,
    consumerId: userId,
  });

  ok(ctx as Context, messageList);

  log.info('getMessage: message is successfully received');
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: messageId } = ctx.params;

  await messageService.deleteOne(messageId);

  ok(ctx as Context);

  log.info('removeMessage: message is successfully removed');
};

const clear = async (ctx: ParameterizedContext): Promise<void> => {
  await messageService.deleteAll();

  ok(ctx as Context);

  log.info('clear: all messages are successfully removed');
};

export { newMessage, removeMessage, getMessage, clear };
