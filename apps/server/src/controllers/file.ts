import { Context, ParameterizedContext } from 'koa';

import { IFileIds } from '@lib/types';

import { fileService } from '../services';

import { ok, notOk } from '../utils/apiHelpers';

const mime = require('mime');

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

  if (typeof company === 'string' && company) {
    params.company = company;
  }

  if (typeof fileName === 'string' && fileName) {
    params.fileName = fileName;
  }

  if (typeof path === 'string' && path) {
    params.path = path;
  }

  if (typeof uid === 'string' && uid) {
    params.uid = uid;
  }

  if (typeof date === 'string' && date) {
    params.date = date;
  }

  if (typeof appSystem === 'string' && appSystem) {
    params.appSystem = appSystem;
  }

  if (typeof consumer === 'string' && consumer) {
    params.consumer = consumer;
  }

  if (typeof producer === 'string' && producer) {
    params.producer = producer;
  }

  if (typeof device === 'string' && device) {
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

const downloadFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;
  const file = await fileService.downloadOne(id);
  ctx.attachment(file.fileName);

  ok(ctx as Context, file, 'getFile: file is successfully  received');
};

const removeFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;

  await fileService.deleteOne(id);

  ok(ctx as Context, undefined, 'removeFile: file is successfully  deleted');
};

const removeManyFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const { action } = ctx.query;

  if (!action || (action !== 'delete' && action !== 'move')) {
    notOk(ctx as Context);
    return;
  }
  const { ids, folderName } = ctx.request.body as IFileIds;

  if (action === 'move' && !folderName) {
    notOk(ctx as Context);
    return;
  }

  action === 'move' ? await fileService.moveMany(ids, folderName!) : await fileService.deleteMany(ids);
  const actionName = action === 'move' ? 'moved' : 'deleted';

  ok(ctx as Context, undefined, `removeManyFiles: files are successfully  ${actionName}`);
};

const updateFile = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.request.params;

  const fileData = ctx.request.body as Partial<any>;

  const updatedFile = fileService.updateOne(id, fileData);

  ok(ctx as Context, updatedFile, `updateFile: file '${id}' is successfully updated`);
};

const getFolders = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemId } = ctx.request.query;
  const folderlist = await fileService.getFolders({
    companyId: companyId as string,
    appSystemId: appSystemId as string,
  });

  ok(ctx as Context, folderlist, 'getfolders: folders is successfully  received');
};
export { getFiles, getFile, removeFile, updateFile, removeManyFiles, getFolders, downloadFile };
