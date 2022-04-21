import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { processService } from '../services';

import { ok } from '../utils/apiHelpers';

const addProcess = (ctx: ParameterizedContext) => {
  const { companyId, appSystem } = ctx.params;
  //companyId можем узнать из user.json по userId
  const userId = ctx.state.user.id;

  const response = processService.addProcess(appSystem, companyId, userId);

  ok(ctx as Context, response);

  log.info('AddProcess');
};

const api2 = async (ctx: ParameterizedContext): Promise<void> => {
  // const { id: processId } = ctx.params;
  // await processService.apiTwo(processId);
  // ok(ctx as Context);
  // log.info('Commit transaction is successful');
};

const updateProcess = (ctx: ParameterizedContext) => {
  const { id: processId, processedFiles } = ctx.params;

  processService.updateProcessById(processId, processedFiles);

  ok(ctx as Context);

  log.info('UpdateProcess');
};

const removeProcess = (ctx: ParameterizedContext) => {
  processService.removeProcessById(ctx.params.processId);

  ok(ctx as Context);

  log.info('RemoveProcess');
};

const cancelProcess = (ctx: ParameterizedContext) => {
  const { id: processId, errorMessage } = ctx.params;

  processService.cancelProcessById(processId, errorMessage);

  ok(ctx as Context);

  log.info('CancelProcess');
};

const breakProcess = (ctx: ParameterizedContext) => {
  const { id: processId, errorMessage } = ctx.params;

  processService.breakProcessById(processId, errorMessage);

  ok(ctx as Context);

  log.info('BreakProcess');
};

export { addProcess, api2, updateProcess, removeProcess, cancelProcess, breakProcess };
