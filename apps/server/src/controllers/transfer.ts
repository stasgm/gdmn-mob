import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { created, notOk, ok } from '../utils/apiHelpers';
import { clearTransferFlag, getTransferFlag, setTransferFlag } from '../services/transferService';

const setTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  let currentProcess = getTransferFlag();

  if (currentProcess) {
    // вернем на сервер сообщение, что сервер занят
    notOk(ctx as Context);
    log.info(`Server is busy processing ${currentProcess.uid}, started: ${currentProcess.uDate}`);
  } else {
    currentProcess = setTransferFlag();
    created(ctx as Context, currentProcess);
    log.info(`Процесс ${currentProcess.uid} начат в ${currentProcess.uDate}`);
  }
};

const getTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  ok(ctx as Context, getTransferFlag());
  log.info('Процесс успешно проверен ');
};

const deleteTransfer = async (ctx: ParameterizedContext): Promise<void> => {
  //на будущее, когда будет массив параллельных процессов
  //const { uid: uid } = ctx.params;

  const currentProcess = getTransferFlag();

  if (!currentProcess) {
    log.error('Это какая-то ошибка в логике. Пришел запрос очистить процесс, а его нет...');
    ok(ctx as Context);
  } else {
    clearTransferFlag();
    ok(ctx as Context);
    log.info(`Процесс ${currentProcess.uid} завершен`);
  }
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
