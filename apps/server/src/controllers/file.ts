import { Context, ParameterizedContext } from 'koa';

import { IFileIds, IFileObject } from '@lib/types';

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
    folder,
    dateFrom,
    dateTo,
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

  if (typeof dateFrom === 'string' && dateFrom) {
    params.dateFrom = dateFrom;
  }

  if (typeof dateTo === 'string' && dateTo) {
    params.dateTo = dateTo;
  }

  if (typeof folder === 'string' && folder) {
    params.folder = folder;
  }

  const filesList = await fileService.findMany(params);

  ok(ctx as Context, filesList, 'getFiles: deviceLogs are successfully received');
};

export const getFileParams = async (ctx: ParameterizedContext): Promise<IFileObject> => {
  const { id } = ctx.request.params;
  const { companyId, appSystemId, folder, ext } = ctx.query;

  const params: IFileObject = { id: id };

  if (typeof companyId === 'string' && companyId) {
    params.companyId = companyId;
  }

  if (typeof appSystemId === 'string' && appSystemId) {
    params.appSystemId = appSystemId;
  }

  if (typeof folder === 'string' && folder) {
    params.folder = folder;
  }

  if (typeof ext === 'string' && ext) {
    params.ext = ext;
  }

  return params;
};

const getFile = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await getFileParams(ctx);
  const file = await fileService.findOne(params);

  ok(ctx as Context, file, 'getFile: file is successfully  received');
};

const removeFile = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await getFileParams(ctx);

  await fileService.deleteOne(params);

  ok(ctx as Context, undefined, 'removeFile: file is successfully  deleted');
};

const removeManyFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const { action } = ctx.query;

  if (!action || (action !== 'delete' && action !== 'move')) {
    notOk(ctx as Context);
    return;
  }
  const { ids, toFolder } = ctx.request.body as IFileIds;

  if (action === 'move' && !toFolder) {
    notOk(ctx as Context);
    return;
  }

  action === 'move' ? await fileService.moveMany(ids, toFolder!) : await fileService.deleteMany(ids);
  const actionName = action === 'move' ? 'moved' : 'deleted';

  ok(ctx as Context, undefined, `removeManyFiles: files are successfully  ${actionName}`);
};

const updateFile = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await getFileParams(ctx);

  const fileData = ctx.request.body as Partial<any>;

  const updatedFile = fileService.updateOne(params, fileData);

  ok(ctx as Context, updatedFile, `updateFile: file '${params.id}' is successfully updated`);
};

const getFolders = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, appSystemId } = ctx.request.query;
  const folderlist = await fileService.getFolders({
    companyId: companyId as string,
    appSystemId: appSystemId as string,
  });

  ok(ctx as Context, folderlist, 'getfolders: folders is successfully  received');
};
export { getFiles, getFile, removeFile, updateFile, removeManyFiles, getFolders };
