import { Context } from 'koa';

import { AddProcess, InterruptProcess, CancelProcess, UpdateProcess, PrepareProcess } from '@lib/types';

import { processService } from '../services';

import { created, ok } from '../utils/apiHelpers';
import { InvalidParameterException } from '../exceptions';

/**
 * API 1
 * @param ctx
 */
export const addProcess = async (ctx: Context) => {
  const { appSystemId, companyId, consumerId, producerIds, maxDataVolume, maxFiles } = ctx.request.body as AddProcess;
  const deviceId = ctx.query.deviceId;
  if (typeof deviceId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  created(
    ctx,
    processService.addOne({ appSystemId, companyId, consumerId, producerIds, maxDataVolume, maxFiles, deviceId }),
    `addProcess consumerId=${consumerId}`,
  );
};

/**
 * API 2
 * @param ctx
 * @returns
 */
export const updateProcess = async (ctx: Context) =>
  ok(
    ctx,
    processService.updateById(ctx.params.id, (ctx.request.body as UpdateProcess).files),
    `updateProcess id=${ctx.params.id}`,
  );

/**
 * API 3
 * @param ctx
 * @returns
 */
export const prepareProcess = async (ctx: Context) => {
  ok(
    ctx,
    processService.prepareById({
      processId: ctx.params.id,
      producerId: ctx.state.user.id,
      processedFiles: (ctx.request.body as PrepareProcess).processedFiles,
    }),
    `prepareProcess id=${ctx.params.id}`,
  );
};

/**
 * API 4
 * @param ctx
 * @returns
 */
export const completeProcess = async (ctx: Context) =>
  ok(ctx, processService.completeById(ctx.params.id), `completeProcess id=${ctx.params.id}`);

export const cancelProcess = async (ctx: Context) =>
  ok(
    ctx,
    processService.cancelById(ctx.params.id, (ctx.request.body as CancelProcess).errorMessage),
    `cancelProcess id=${ctx.params.id}`,
  );

export const interruptProcess = async (ctx: Context) =>
  ok(
    ctx,
    processService.interruptById(ctx.params.id, (ctx.request.body as InterruptProcess).errorMessage),
    `interruptProcess id=${ctx.params.id}`,
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

export const deleteProcess = async (ctx: Context) =>
  ok(ctx, processService.deleteOne(ctx.params.id), `deleteProcess id=${ctx.params.id}`);
