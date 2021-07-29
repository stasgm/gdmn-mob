//import { v1 as uuidv1 } from 'uuid';
import { Context, ParameterizedContext } from 'koa';

import { IResponse, IMessage, NewMessage } from '@lib/types';

import log from '../utils/logger';
import { messageService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { ForbiddenException } from '../exceptions';

let clients: ((result: IMessage[]) => void)[] = [];

const newMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const message = ctx.request.body as NewMessage;

  // if (!message.head) {
  //   ctx.throw(400, 'отсутствует заголовок сообщения');
  // }

  // if (!message.body) {
  //   ctx.throw(400, 'отсутствует сообщение');
  //  }

  // if (!(message.body.type && message.body.payload && message.head.company)) {
  //   ctx.throw(400, 'некорректный формат сообщения');
  // }

  // if (!(ctx.state.user.companies as string[]).find((item) => item === message.head.company.id)) {
  //   ctx.throw(403, 'Пользователь не входит в организацию указанную в заголовке сообщения');
  // }

  if (ctx.state.user.company.id !== message.head.company.id) {
    throw new ForbiddenException('Пользователь не входит в организацию указанную в заголовке сообщения');
  }

  // try {
  const messageId = await messageService.addOne({ msgObject: message, producerId: ctx.state.user.id });

  // const result: IResponse<{ uid: string; date: Date }> = {
  //   result: true,
  //   data: { uid: messageId, date: new Date() },
  // };

  const resultData = { uid: messageId, date: new Date() };
  created(ctx as Context, resultData);
  // ctx.status = 201;
  // ctx.body = result;

  log.info('newMessage: message is successfully created');

  // } catch (err) {
  //   ctx.throw(400, err.message);
  // }
};

const getMessage = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystem } = ctx.params;
  const userId = ctx.state.user.id;

  //const params: Record<string, string> = {};

  // if (typeof companyName === 'string') {
  //   params.name = companyName;
  // }

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

  //const userId = ctx.state.user.id;

  // const user = await userService.findOne(userId);

  // if (!user) {
  //   ctx.throw(400, 'Пользователь не найден');
  // }

  // if (user.name === 'gdmn') {
  //   // TODO переделать
  //   userId = 'gdmn';
  // }

  await messageService.deleteOne(messageId);

  ok(ctx as Context);

  log.info('removeDevice: message is successfully removed');
};

const clear = async (ctx: ParameterizedContext): Promise<void> => {
  await messageService.deleteAll();

  ok(ctx as Context);

  log.info('clear: all messages are successfully removed');
};

const subscribe = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystem } = ctx.params;

  ctx.set('Cache-Control', 'no-cache,must-revalidate');

  const userId = ctx.state.user.id;
  const messageList = await messageService.FindMany({
    appSystem,
    companyId,
    consumerId: userId,
  });

  ok(ctx as Context, messageList);

  log.info('get message');

  const promise = new Promise<IMessage[]>((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on('close', () => {
      clients.splice(clients.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.name = 'ECONNRESET';
      reject(error);
    });
  });

  let message: string | any[] = '';

  try {
    message = (await promise).filter((mes) => mes.head.consumer === ctx.state.user.id);
  } catch (err) {
    if (err instanceof Error && err.name === 'ECONNRESET') return;

    log.warn(`Error - ${err}`);

    const result: IResponse<undefined> = {
      result: false,
      error: 'file or directory not found',
    };
    ctx.status = 404;
    ctx.body = JSON.stringify(result);
  }

  if (message && message.length > 0) {
    // console.log('DONE', message);

    clients = [];

    ctx.status = 200;
    ctx.body = JSON.stringify(message);
  }
};

const publish = async (ctx: ParameterizedContext): Promise<void> => {
  const message = ctx.request.body as NewMessage;

  // if (!message.head) {
  //   ctx.throw(400, 'отсутствует заголовок сообщения');
  // }

  // if (!message.body) {
  //   ctx.throw(400, 'отсутствует сообщение');
  // }

  // if (!(message.body.type && message.body.payload && message.head.company.id)) {
  //   ctx.throw(400, 'некорректный формат сообщения');
  // }

  // if (!(ctx.state.user.companies as string[]).find((item) => item === message.head.company.id)) {
  //   ctx.throw(403, 'Пользователь не входит в организацию указанную в заголовке сообщения');
  // }

  if (ctx.state.user.company.id !== message.head.company.id) {
    throw new ForbiddenException('Пользователь не входит в организацию указанную в заголовке сообщения');
  }

  //try {
  /*const msgObject: IDBMessage = {
      id: uuidv1(),
      head: {
        companyId: head.company.id,
        consumerId: head.consumer.id || 'gdmn',
        producerId: ctx.state.user.id,
        dateTime: new Date().toISOString(),
        appSystem: head.appSystem,
      },
      body,
    };*/

  const messageId = await messageService.addOne({ msgObject: message, producerId: ctx.state.user.id });

  // const result: IResponse<{ uid: string; date: Date }> = {
  //   result: true,
  //   data: { uid: messageId, date: new Date() },
  // };

  // ctx.status = 201;
  // ctx.body = result;
  const resultData = { uid: messageId, date: new Date() };
  created(ctx as Context, resultData);

  log.info('newMessage: message is successfully created');

  // } catch (err) {
  //   ctx.throw(400, err.message);
  // }
};

export { newMessage, removeMessage, getMessage, publish, subscribe, clear };
