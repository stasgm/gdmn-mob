import { Context, ParameterizedContext } from 'koa';

import { fileService } from '../services';

import { ok } from '../utils/apiHelpers';

const getFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const filesList = await fileService.findMany();

  ok(ctx as Context, filesList, 'getFiles: deviceLogs are successfully received');
};

export { getFiles };
