import { Context } from 'koa';

import { AddProcess, InterruptProcess, CancelProcess, UpdateProcess, PrepareProcess } from '@lib/types';

import { processService } from '../services';

import { created, ok } from '../utils/apiHelpers';

/**
 * API 1
 * @param ctx
 */
export const addProcess = async (ctx: Context) => {
  const { appSystemId, companyId, consumerId, producerIds, maxDataVolume, maxFiles } = ctx.request.body as AddProcess;

  created(
    ctx,
    processService.addOne({ appSystemId, companyId, consumerId, producerIds, maxDataVolume, maxFiles }),
    'addProcess',
  );
};

/**
 * API 2
 * @param ctx
 * @returns
 */
export const updateProcess = async (ctx: Context) =>
  ok(ctx, processService.updateById(ctx.params.id, (ctx.request.body as UpdateProcess).files), 'updateProcess');

/**
 * API 3
 * @param ctx
 * @returns
 */
export const prepareProcess = async (ctx: Context) =>
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
export const completeProcess = async (ctx: Context) =>
  ok(ctx, processService.completeById(ctx.params.id), 'completeProcess');

export const cancelProcess = async (ctx: Context) =>
  ok(ctx, processService.cancelById(ctx.params.id, (ctx.request.body as CancelProcess).errorMessage), 'cancelProcess');

export const interruptProcess = async (ctx: Context) =>
  ok(
    ctx,
    processService.interruptById(ctx.params.id, (ctx.request.body as InterruptProcess).errorMessage),
    'interruptProcess',
  );

export const getProcesses = async (ctx: Context) => {
  const { companyId, appSystemId, filterText, fromRecord, toRecord } = ctx.query;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }
  if (appSystemId && typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string') {
    params.fromRecord = fromRecord;
  }

  if (typeof toRecord === 'string') {
    params.toRecord = toRecord;
  }

  ok(ctx, processService.findMany(params), 'getProcesses');
};

export const deleteProcess = async (ctx: Context) => ok(ctx, processService.deleteOne(ctx.params.id), 'deleteProcess');
