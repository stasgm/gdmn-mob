import { Context, ParameterizedContext } from 'koa';

import { IUser, NewUser } from '@lib/types';

import { userService } from '../services';

import { created, ok } from '../utils';

import { DataNotFoundException } from '../exceptions';

const addUser = async (ctx: ParameterizedContext) => {
  const {
    externalId,
    name,
    password,
    firstName,
    lastName,
    middleName,
    phoneNumber,
    email,
    alias,
    erpUser,
    appSystem,
    disabled,
    company,
    accessCode,
  } = ctx.request.body as NewUser;

  const creator = ctx.state.user as IUser;

  const user = {
    externalId,
    password,
    name,
    alias,
    firstName,
    lastName,
    middleName,
    phoneNumber,
    email,
    role: 'User',
    erpUser,
    appSystem,
    disabled,
    creator: { id: creator.id, name: creator.name },
    company,
    accessCode,
  } as NewUser;

  const newUser = userService.addOne(user);

  created(ctx as Context, newUser, `signup: user '${name}' is successfully signed up`);
};

const updateUser = async (ctx: ParameterizedContext) => {
  const { id: userId } = ctx.params;
  // TODO Исключать поля: role, creator, creationDate, company
  const userData = ctx.request.body as Partial<IUser & { password: string }>;

  const updatedUser = userService.updateOne(userId, userData);

  ok(ctx as Context, updatedUser, `updatedUser: user '${updatedUser.name}' is successfully updated`);
};

const removeUser = async (ctx: ParameterizedContext) => {
  const { id: userId } = ctx.params;

  userService.deleteOne(userId);

  ok(ctx as Context, undefined, `removeUser: user '${removeUser.name}' is successfully removed `);
};

const getUser = async (ctx: ParameterizedContext) => {
  const { id: userId } = ctx.params;

  const user = userService.findOne(userId);

  if (!user) {
    throw new DataNotFoundException(`Пользователь ${userId} не найден`);
  }

  ok(ctx as Context, user, `getUser: user '${user.name}' (${user.id}) is successfully received'`);
};

const getUserWithDevice = async (ctx: ParameterizedContext) => {
  const { id: userId } = ctx.params;

  const user = userService.findOneWithDevice(userId);

  if (!user) {
    throw new DataNotFoundException(`Пользователь ${userId} не найден`);
  }

  ok(ctx as Context, user, ` getUserWithDevice : user '${user.name}' (${user.id}) is successfully received'`);
};

const getUsers = async (ctx: ParameterizedContext) => {
  const { companyId, name, filterText, fromRecord, toRecord, version, appSystemId, erpUserId } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  if (typeof erpUserId === 'string') {
    params.erpUserId = erpUserId;
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
      users = userService.findMany(params);
      /** example for versioning */
      //users = verUsers.v1.myFunction(params);
      break;
    case '2.0.0':
      users = userService.findMany(params);
      /** example for versioning */
      //users = verUsers.v2.myFunction(params);
      break;
    default:
      users = userService.findMany(params);
      break;
  }

  ok(ctx as Context, users, 'getUsers: users are successfully received');
};

const getUsersWithDevice = async (ctx: ParameterizedContext) => {
  const { companyId, name, filterText, fromRecord, toRecord, version, appSystemId, erpUserId } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  if (typeof erpUserId === 'string') {
    params.erpUserId = erpUserId;
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
      users = userService.findManyWithDevice(params);
      /** example for versioning */
      //users = verUsers.v1.myFunction(params);
      break;
    case '2.0.0':
      users = userService.findManyWithDevice(params);
      /** example for versioning */
      //users = verUsers.v2.myFunction(params);
      break;
    default:
      users = userService.findManyWithDevice(params);
      break;
  }

  ok(ctx as Context, users, 'getUsersWithDevice: users are successfully received');
};

export { addUser, updateUser, removeUser, getUser, getUsers, getUsersWithDevice, getUserWithDevice };
