import { Context, ParameterizedContext } from 'koa';

import { fileService } from '../services';

import { ok } from '../utils/apiHelpers';

const getFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const filesList = await fileService.findMany();

  ok(ctx as Context, filesList, 'getFiles: deviceLogs are successfully received');
};

const getFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const file = await fileService.findOne(id);

  ok(ctx as Context, file, 'getFile: file is successfully  received');
};

export { getFiles, getFile };
