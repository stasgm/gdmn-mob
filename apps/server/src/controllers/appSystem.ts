import { Context, ParameterizedContext } from 'koa';

import { IAppSystem, NewAppSystem } from '@lib/types';

import { appSystemService } from '../services';

import { DataNotFoundException } from '../exceptions';

import { created, ok, prepareParams } from '../utils';

const addAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, description } = ctx.request.body as NewAppSystem;

  const appSystem: NewAppSystem = { name, description };

  const newAppSystem = appSystemService.addOne(appSystem);

  created(ctx as Context, newAppSystem, `addAppSystem: appSystem '${name}' is successfully created`);
};

const updateAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const appSystemData = ctx.request.body as Partial<IAppSystem>;

  const updatedAppSystem = appSystemService.updateOne(id, appSystemData);

  ok(ctx as Context, updatedAppSystem, `updateAppSystem: appSystem '${updatedAppSystem.id}' is successfully updated`);
};

const removeAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  appSystemService.deleteOne(id);

  ok(ctx as Context, undefined, `removeAppSystem: appSystem '${id}' is successfully removed`);
};

const getAppSystems = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(ctx.query, ['companyId', 'name', 'filterText'], ['fromRecord', 'toRecord']);

  const appSystemList = appSystemService.findMany(params);

  ok(ctx as Context, appSystemList, 'getAppSystem: app systems are successfully received');
};

const getAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const appSystem = appSystemService.findOne(id);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  ok(ctx as Context, appSystem, `getAppSystem: appSystem '${appSystem.name}' is successfully received`);
};

export { getAppSystem, getAppSystems, addAppSystem, updateAppSystem, removeAppSystem };
