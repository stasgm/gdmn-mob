import { Context, ParameterizedContext } from 'koa';

import { AddProcess, InterruptProcess, CancelProcess, UpdateProcess } from '@lib/types';

import log from '../utils/logger';
import { processService } from '../services';

import { ok } from '../utils/apiHelpers';

const addProcess = (ctx: ParameterizedContext) => {
  const body = ctx.request.body as AddProcess;
  //companyId можем узнать из user.json по userId

  const response = processService.addOne(body);
  ok(ctx as Context, response);

  log.info('addProcess', response);
};

const api2 = async (ctx: ParameterizedContext): Promise<void> => {
  // const { id: processId } = ctx.params;
  // await processService.apiTwo(processId);
  // ok(ctx as Context);
  // log.info('Commit transaction is successful');
};

const updateProcess = (ctx: ParameterizedContext) => {
  const { processedFiles } = ctx.request.body as UpdateProcess;

  const response = processService.updateOneById(ctx.params.id, processedFiles);

  ok(ctx as Context, response);

  log.info('updateProcess', response);
};

const completeProcess = (ctx: ParameterizedContext) => {
  const response = processService.completeById(ctx.params.id);

  ok(ctx as Context, response);

  log.info('completeProcess', response);
};

const cancelProcess = (ctx: ParameterizedContext) => {
  const { errorMessage } = ctx.request.body as CancelProcess;

  const response = processService.cancelById(ctx.params.id, errorMessage);

  ok(ctx as Context, response);

  log.info('cancelProcess', response);
};

const interruptProcess = (ctx: ParameterizedContext) => {
  const { errorMessage } = ctx.request.body as InterruptProcess;

  const response = processService.interruptById(ctx.params.id, errorMessage);

  ok(ctx as Context, response);

  log.info('interruptProcess', response);
};

const getProcesses = (ctx: ParameterizedContext) => {
  const { companyId, appSystem } = ctx.params;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (appSystem && typeof appSystem === 'string') {
    params.appSystem = appSystem;
  }

  const response = processService.findMany(params);

  ok(ctx as Context, response);

  log.info('getProcesses', response);
};

const deleteProcess = (ctx: ParameterizedContext) => {
  const response = processService.completeById(ctx.params.id);

  ok(ctx as Context, response);

  log.info('completeProcess', response);
};

export {
  addProcess,
  api2,
  updateProcess,
  completeProcess,
  cancelProcess,
  interruptProcess,
  getProcesses,
  deleteProcess,
};
