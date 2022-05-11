import { Context, ParameterizedContext } from 'koa';

import { IAppSystem, IUser, NewAppSystem } from '@lib/types';

import { appSystemService } from '../services';

import { DataNotFoundException, ForbiddenException } from '../exceptions';

import { created, ok } from '../utils/apiHelpers';

const addAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, description } = ctx.request.body as NewAppSystem;

  const appSystem: NewAppSystem = { name, description };

  const newAppSystem = await appSystemService.addOne(appSystem);

  created(ctx as Context, newAppSystem, `addAppSystem: appSystem '${name}' is successfully created`);
};

const updateAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const user = ctx.state.user as IUser;

  const appSystemData = ctx.request.body as Partial<IAppSystem>;

  const updatedAppSystem = await appSystemService.updateOne(id, appSystemData);

  ok(ctx as Context, updatedAppSystem, `updateAppSystem: appSystem '${updatedAppSystem.id}' is successfully updated`);
};

const removeAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const user = ctx.state.user as IUser;

  await appSystemService.deleteOne(id);

  ok(ctx as Context, undefined, `removeAppSystem: appSystem '${id}' is successfully removed`);
};

const getAppSystems = async (ctx: ParameterizedContext): Promise<void> => {
  const { appSystemId, name } = ctx.query;

  const params: Record<string, string> = {};

  if (appSystemId && typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  if (name && typeof name === 'string') {
    params.name = name;
  }

  const appSystemList = await appSystemService.findAll(params);

  ok(ctx as Context, appSystemList, 'getAppSystem: app systems are successfully received');
};

const getAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const appSystem = await appSystemService.findOne(id);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  ok(ctx as Context, appSystem, `getAppSystem: appSystem '${appSystem.name}' is successfully received`);
};

export { getAppSystem, getAppSystems, addAppSystem, updateAppSystem, removeAppSystem };
