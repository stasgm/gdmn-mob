import { Context, ParameterizedContext } from 'koa';

import { fileService } from '../services';

import { ok } from '../utils/apiHelpers';

const getFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const filesList = await fileService.findMany();

  ok(ctx as Context, filesList, 'getFiles: deviceLogs are successfully received');
};

const getFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;

  const file = await fileService.findOne(id);

  ok(ctx as Context, file, 'getFile: file is successfully  received');
};

const removeFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;

  await fileService.deleteOne(id);

  ok(ctx as Context, undefined, 'removeFile: file is successfully  deleted');
};

const removeManyFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const ids = ctx.request.body as string[];

  await fileService.deleteMany(ids);

  ok(ctx as Context, undefined, 'removeManyFiles: files are successfully  deleted');
};

const updateFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;

  const fileData = ctx.request.body as Partial<any>;

  const updatedFile = fileService.updateOne(id, fileData);

  ok(ctx as Context, updatedFile, `updateFile: file '${id}' is successfully updated`);
};

export { getFiles, getFile, removeFile, updateFile, removeManyFiles };
