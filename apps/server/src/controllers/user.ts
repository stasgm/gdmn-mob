import { Context, ParameterizedContext } from 'koa';

import { IUser, NewUser } from '@lib/types';

import { userService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

const addUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { externalId, name, password, firstName, lastName, phoneNumber, email, alias, erpUser, appSystem } = ctx.request
    .body as NewUser;

  const creator = ctx.state.user as IUser;

  const user = {
    externalId,
    password,
    name,
    alias,
    firstName,
    lastName,
    phoneNumber,
    email,
    role: 'User',
    erpUser,
    appSystem,
    creator: { id: creator.id, name: creator.name },
  } as NewUser;

  const newUser = await userService.addOne(user);

  created(ctx as Context, newUser, `signup: user '${name}' is successfully signed up`);
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  // TODO Исключать поля: role, creator, creationDate, company
  const userData = ctx.request.body as Partial<IUser & { password: string }>;

  const updatedUser = await userService.updateOne(userId, userData);

  ok(ctx as Context, updatedUser, `updatedUser: user '${updatedUser.name}' is successfully updated`);
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  await userService.deleteOne(userId);

  ok(ctx as Context, undefined, `removeUser: user '${removeUser.name}' is successfully removed `);
};

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  const user = await userService.findOne(userId);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  ok(ctx as Context, user, `getUser: device '${user.name}' is successfully received'`);
};

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, name, filterText, fromRecord, toRecord, version } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof name === 'string') {
    params.name = name;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string') {
    params.fromRecord = fromRecord;
  }

  if (typeof toRecord === 'string') {
    params.toRecord = toRecord;
  }

  let users;
  switch (version) {
    case '1.0.0':
      users = await userService.findAll(params);
      /** example for versioning */
      //users = await verUsers.v1.myFunction(params);
      break;
    case '2.0.0':
      users = await userService.findAll(params);
      /** example for versioning */
      //users = await verUsers.v2.myFunction(params);
      break;
    default:
      users = await userService.findAll(params);
      break;
  }

  ok(ctx as Context, users, 'getUsers: users are successfully received');
};

export { addUser, updateUser, removeUser, getUser, getUsers };
