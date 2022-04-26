import { Context, ParameterizedContext } from 'koa';

import { AddProcess, InterruptProcess, CancelProcess, UpdateProcess, IFiles } from '@lib/types';

import log from '../utils/logger';
import { processService } from '../services';

import { ok } from '../utils/apiHelpers';

const addProcess = (ctx: ParameterizedContext) => {
  const processParams = ctx.request.body as AddProcess;
  //companyId можем узнать из user.json по userId

  const response = processService.addOne(processParams);
  ok(ctx as Context, response);

  log.info('addProcess', response);
};

const updateProcess = (ctx: ParameterizedContext) => {
  const { files } = ctx.request.body as UpdateProcess;

  const response = processService.updateById(ctx.params.id, files);

  ok(ctx as Context, response);

  log.info('updateProcess', response);
};

const prepareProcess = (ctx: ParameterizedContext) => {
  const processedFiles = ctx.request.body as IFiles;

  const response = processService.prepareById(ctx.params.id, processedFiles);

  ok(ctx as Context, response);

  log.info('setReadyToCommit', response);
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
  updateProcess,
  prepareProcess,
  completeProcess,
  cancelProcess,
  interruptProcess,
  getProcesses,
  deleteProcess,
};
