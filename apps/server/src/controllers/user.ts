import { Context, ParameterizedContext } from 'koa';

import { IUser, NewUser } from '@lib/types';

import log from '../utils/logger';
import { userService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

const addUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { externalId, name, password, firstName, lastName, phoneNumber, companies, creator } = ctx.request
    .body as NewUser;

  const user: NewUser = {
    externalId,
    password,
    name,
    firstName,
    lastName,
    phoneNumber,
    companies: companies || [],
    creator,
  };

  const newUser = await userService.addOne(user);

  created(ctx as Context, newUser);

  log.info(`signUp: user '${name}' is successfully signed up`);
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  const userData = ctx.request.body as Partial<IUser & { password: string }>;

  const updatedUser = await userService.updateOne(userId, userData);

  ok(ctx as Context, updatedUser);

  log.info(`updatedUser: user '${updatedUser.name}' is successfully updated`);
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  // TODO пользовате
  await userService.deleteOne(userId);

  ok(ctx as Context, removeUser);

  log.info(`removeUser: user '${removeUser.name}' is successfully removed `);
};

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  const user = await userService.findOne(userId);

  if (!user) {
    throw new DataNotFoundException('пользователь не найден');
    //ctx.throw(404, 'пользователь не найден');
  }

  ok(ctx as Context, user);

  log.info(`getUser: device '${user.name}' is successfully received'`);
};

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, name } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof name === 'string') {
    params.name = name;
  }

  const users = await userService.findAll(params);

  ok(ctx as Context, users);

  log.info('getUsers: users are successfully received');
};

// const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id: userId } = ctx.params;

//   if (!userId) {
//     ctx.throw(400, 'не указан идентификатор пользователя');
//   }

//   try {
//     const deviceIfno = await userService.findDevices(userId);

//     const result: IResponse<IDevice[]> = { result: true, data: deviceIfno };

//     ctx.status = 200;
//     ctx.body = result;

//     log.info('getDevicesByUser: OK');
//   } catch (err) {
//     ctx.throw(400, err);
//   }
// };

export { addUser, updateUser, removeUser, getUser, getUsers };
