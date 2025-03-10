import { Context, ParameterizedContext } from 'koa';

import { NewMessage } from '@lib/types';

import { messageService } from '../services';

import { created, ok } from '../utils';

import { ForbiddenException, InvalidParameterException } from '../exceptions';

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const message = ctx.request.body as NewMessage;
  const user = ctx.state.user;
  const deviceId = ctx.query.deviceId;

  if (user.company.id !== message.head.company.id) {
    throw new ForbiddenException('Пользователь не входит в организацию указанную в заголовке сообщения');
  }

  if (typeof deviceId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  const messageId = await messageService.addOne({
    msgObject: message,
    producerId: user.id,
    appSystemId: message.head.appSystem.id,
    companyId: message.head.company.id,
    deviceId: deviceId,
  });

  const resultData = { uid: messageId, date: new Date() };
  created(
    ctx as Context,
    resultData,
    `newMessage: message '${messageId}' deviceId=${deviceId} is successfully created`,
  );
};

const getMessages = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemName, deviceId, limitFiles, maxDataVolume } = ctx.query;

  if (typeof deviceId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  const messageList = await messageService.FindMany({
    companyId: companyId as string,
    appSystemName: appSystemName as string,
    consumerId: ctx.state.user.id,
    deviceId: deviceId,
    maxDataVolume: typeof maxDataVolume === 'string' ? Number(maxDataVolume) : undefined,
    maxFiles: typeof limitFiles === 'string' ? Number(limitFiles) : undefined,
  });

  ok(ctx as Context, messageList, `getMessages: message deviceId=${deviceId} is successfully received`);
};

const removeMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: messageId } = ctx.params;
  const { companyId, appSystemName } = ctx.query;

  await messageService.deleteOne({ messageId, companyId: companyId as string, appSystemName: appSystemName as string });

  ok(ctx as Context, undefined, `removeMessage: message '${messageId}' is successfully removed`);
};

const clear = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemName } = ctx.params;
  await messageService.clear({ companyId, appSystemName });

  ok(ctx as Context, undefined, 'clear: all messages are successfully removed');
};

export { newMessage, removeMessage, getMessages, clear };
