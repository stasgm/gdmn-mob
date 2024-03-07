import { Context, ParameterizedContext } from 'koa';

import { IDeleteDeviceLogsRequest, IDeviceLogParams, IUser } from '@lib/types';

import { deviceLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { notOk, ok, prepareParams } from '../utils';
import { deviceLogFolder, getFileParams } from '../services/fileUtils';

const addDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { appVersion, appSettings, deviceLog, companyId, appSystemId } = ctx.request.body as IDeviceLogParams;
  const deviceId = ctx.query.deviceId as string;
  const user = ctx.state.user as IUser;

  if (typeof deviceId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  deviceLogService.addOne({
    appVersion: appVersion || '',
    appSettings: appSettings || {},
    deviceLog,
    producerId: user.id,
    appSystemId,
    companyId,
    deviceId,
  });

  ok(ctx as Context, undefined, `add deviceLog: DeviceLog for device uid=${deviceId} is successfully created`);
  return;
};

const getDeviceLogContent = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await getFileParams(ctx.params, ctx.query);
  params.folder = deviceLogFolder;

  const deviceLog = await deviceLogService.getContent(params);

  ok(ctx as Context, deviceLog, 'getDeviceLog: DeviceLog is successfully  received');
};

const getDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(
    ctx.query,
    [
      'companyId',
      'appSystemId',
      'producerId',
      'uid',
      'deviceId',
      'dateFrom',
      'dateTo',
      'mDateFrom',
      'mDateTo',
      'filterText',
      'searchQuery',
    ],
    ['fromRecord', 'toRecord'],
  );

  const deviceLogList = await deviceLogService.findMany(params);

  ok(ctx as Context, deviceLogList, 'getDeviceLogs: deviceLogs are successfully received');
};

const deleteDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await getFileParams(ctx.params, ctx.query);
  params.folder = deviceLogFolder;

  await deviceLogService.deleteOne(params);

  ok(ctx as Context, undefined, `deleteDeviceLog: DeviceLog '${params.id}' is successfully removed`);
};

const deleteDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const { files } = ctx.request.body as IDeleteDeviceLogsRequest;

  const deletedFiles = await deviceLogService.deleteMany(files.map((file) => ({ ...file, folder: deviceLogFolder })));

  const hasSuccess = deletedFiles.some((result) => result.success);

  if (hasSuccess) {
    // Если хотя бы один файл успешно удален, возвращаем список всех файлов со статусом удаления
    ok(ctx as Context, deletedFiles, 'deleteDeviceLogs: files are successfully deleted');
  } else {
    // Иначе возвращаем ошибку со списком файлов и описанием ошибки
    notOk(ctx as Context, 500, 'deleteDeviceLogs: files are not deleted', deletedFiles);
  }
};

export { addDeviceLog, getDeviceLogs, getDeviceLogContent, deleteDeviceLog, deleteDeviceLogs };
