import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { transferService } from '../services';

import { created, ok } from '../utils/apiHelpers';

const setTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  const setInfo = await transferService.setTransfer();

  created(ctx as Context, setInfo);

  log.info(`Процесс ${setInfo?.uid} начат в ${setInfo?.uDate}`);
};

const getTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  const getInfo = await transferService.getTransfer();

  ok(ctx as Context, getInfo);

  log.info('Процесс успешно проверен ');
};

const deleteTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  const { uid: uid } = ctx.params;
  await transferService.deleteTransfer(uid);

  ok(ctx as Context);

  log.info(`Процесс ${uid} завершен`);
};

/* const insertTransfer = async (ctx: ParameterizedContext): Promise<void> => {
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
}; */

export { setTransfer, deleteTransfer, getTransfer };
