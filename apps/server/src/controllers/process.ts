import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { messageService, processService } from '../services';

import { ok } from '../utils/apiHelpers';

const api1 = async (ctx: ParameterizedContext): Promise<void> => {
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

const api2 = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: processId } = ctx.params;

  await processService.apiTwo(processId);

  ok(ctx as Context);

  log.info('Commit transaction is successful');
};

const api3 = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: processId } = ctx.params;

  await processService.apiThree(processId);

  ok(ctx as Context);

  log.info('Commit transaction is successful');
};

const api4 = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: processId } = ctx.params;

  await processService.apiFour(processId);

  ok(ctx as Context);

  log.info('Commit transaction is successful');
};

const api5 = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: processId } = ctx.params;

  await processService.apiFive(processId);

  ok(ctx as Context);

  log.info('Commit transaction is unsuccessful');
};

const api6 = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: processId } = ctx.params;

  await processService.apiSix(processId);

  ok(ctx as Context);

  log.info('removeProcess: process is successfully removed');
};

export { api1, api2, api3, api4, api5, api6 };
