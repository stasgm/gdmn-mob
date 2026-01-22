import { Context, ParameterizedContext } from 'koa';

import { IServerLogFile } from '@lib/types';

import { serverLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { ok } from '../utils/apiHelpers';

const getServerLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const params: Record<string, string | number> = {};

  const { filterText } = ctx.query;

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  const serverLogList: IServerLogFile[] = await serverLogService.findMany(params);

  ok(ctx as Context, serverLogList, 'getServerLogs: serverLogs are successfully received');
};

const getServerLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;
  const { start, end } = ctx.query;
  const paramStart = typeof start === 'string' && isFinite(Number(start)) ? Number(start) : undefined;
  const paramEnd = typeof end === 'string' && isFinite(Number(end)) ? Number(end) : undefined;

  const serverLog = await serverLogService.findOne(id, paramStart, paramEnd);

  ok(ctx as Context, serverLog, 'getServerLog: ServerLog is successfully  received');
};

export { getServerLogs, getServerLog };
