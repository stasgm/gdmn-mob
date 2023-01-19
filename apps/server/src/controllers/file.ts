import { Context, ParameterizedContext } from 'koa';

import { IFileIds } from '@lib/types';

import { fileService } from '../services';

import { ok, notOk } from '../utils/apiHelpers';

const getFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const params: Record<string, string | number> = {};

  const {
    path,
    fileName,
    uid,
    date,
    company,
    appSystem,
    consumer,
    producer,
    device,
    filterText,
    fromRecord,
    toRecord,
  } = ctx.query;

  if (typeof company === 'string') {
    params.company = company;
  }

  if (typeof fileName === 'string') {
    params.fileName = fileName;
  }

  if (typeof path === 'string') {
    params.path = path;
  }

  if (typeof uid === 'string') {
    params.uid = uid;
  }

  if (typeof date === 'string') {
    params.date = date;
  }

  if (typeof appSystem === 'string') {
    params.appSystem = appSystem;
  }

  if (typeof consumer === 'string') {
    params.consumer = consumer;
  }

  if (typeof producer === 'string') {
    params.producer = producer;
  }

  if (typeof device === 'string') {
    params.device = device;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string' && isFinite(Number(fromRecord))) {
    params.fromRecord = Number(fromRecord);
  }

  if (typeof toRecord === 'string' && isFinite(Number(toRecord))) {
    params.toRecord = Number(toRecord);
  }

  const filesList = await fileService.findMany(params);

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
  const { action } = ctx.query;

  if (!action || action !== 'delete') {
    notOk(ctx as Context);
    return;
  }
  const { ids } = ctx.request.body as IFileIds;

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
