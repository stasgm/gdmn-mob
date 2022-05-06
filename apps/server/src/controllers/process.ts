import { Context } from 'koa';

import { AddProcess, InterruptProcess, CancelProcess, UpdateProcess, PrepareProcess } from '@lib/types';

import { processService } from '../services';

import { ok } from '../utils/apiHelpers';

/**
 * API 1
 * @param ctx
 */
export const addProcess = (ctx: Context) =>
  ok(ctx, processService.addOne(ctx.request.body as AddProcess), 'addProcess');

/**
 * API 2
 * @param ctx
 * @returns
 */
export const updateProcess = (ctx: Context) =>
  ok(ctx, processService.updateById(ctx.params.id, (ctx.request.body as UpdateProcess).files), 'updateProcess');

/**
 * API 3
 * @param ctx
 * @returns
 */
export const prepareProcess = (ctx: Context) =>
  ok(
    ctx,
    processService.prepareById({
      processId: ctx.params.id,
      producerId: ctx.state.user.id,
      processedFiles: (ctx.request.body as PrepareProcess).processedFiles,
    }),
    'prepareProcess',
  );

/**
 * API 4
 * @param ctx
 * @returns
 */
export const completeProcess = (ctx: Context) => ok(ctx, processService.completeById(ctx.params.id), 'completeProcess');

export const cancelProcess = (ctx: Context) =>
  ok(ctx, processService.cancelById(ctx.params.id, (ctx.request.body as CancelProcess).errorMessage), 'cancelProcess');

export const interruptProcess = (ctx: Context) =>
  ok(
    ctx,
    processService.interruptById(ctx.params.id, (ctx.request.body as InterruptProcess).errorMessage),
    'interruptProcess',
  );

export const getProcesses = (ctx: Context) => {
  const { companyId, appSystemId } = ctx.query;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }
  if (appSystemId && typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  ok(ctx, processService.findMany(params), 'getProcesses');
};

export const deleteProcess = (ctx: Context) => ok(ctx, processService.deleteOne(ctx.params.id), 'deleteProcess');
