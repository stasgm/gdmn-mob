import { Context, ParameterizedContext } from 'koa';

import { NewMessage } from '@lib/types';

import { messageService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { ForbiddenException } from '../exceptions';

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const message = ctx.request.body as NewMessage;
  const user = ctx.state.user;

  if (user.company.id !== message.head.company.id) {
    throw new ForbiddenException('Пользователь не входит в организацию указанную в заголовке сообщения');
  }
  const messageId = await messageService.addOne({
    msgObject: message,
    producerId: user.id,
    appSystemId: message.head.appSystem.id,
    companyId: message.head.company.id,
  });

  const resultData = { uid: messageId, date: new Date() };
  created(ctx as Context, resultData, 'newMessage: message is successfully created');
};

const getMessages = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemId } = ctx.query;

  const messageList = await messageService.FindMany({
    companyId: companyId as string,
    appSystemId: appSystemId as string,
    consumerId: ctx.state.user.id,
  });

  ok(ctx as Context, messageList, 'getMessages: message is successfully received');
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: messageId } = ctx.params;
  const { companyId, appSystemId } = ctx.query;

  await messageService.deleteOne({ messageId, companyId: companyId as string, appSystemId: appSystemId as string });

  ok(ctx as Context, undefined, 'removeMessage: message is successfully removed');
};

const clear = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemId } = ctx.params;
  await messageService.clear({ companyId, appSystemId });

  ok(ctx as Context, undefined, 'clear: all messages are successfully removed');
};

export { newMessage, removeMessage, getMessages, clear };
