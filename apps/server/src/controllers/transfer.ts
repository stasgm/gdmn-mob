import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { transferService } from '../services';

import { created, ok } from '../utils/apiHelpers';

const insertTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  await transferService.insertEndTransfer();

  created(ctx as Context);

  log.info('endTransafer.txt is successfully created');
};

const checkTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  const checkInfo = await transferService.checkEndTransfer();

  ok(ctx as Context, checkInfo);

  log.info('endTransafer.txt  is successfully checked');
};

const deleteTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  await transferService.deleteEndTransfer();

  ok(ctx as Context);

  log.info('endTransafer.txt is successfully removed');
};

export { insertTransfer, deleteTransfer, checkTransfer };
