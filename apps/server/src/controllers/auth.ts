import { ParameterizedContext, Next, Context } from 'koa';

import { IUser, IUserCredentials, NewUser } from '@lib/types';

import log from '../utils/logger';
import { authService, deviceService } from '../services';
import { created, ok } from '../utils/apiHelpers';

/**
 * Регистрация нового пользователя
 * */
const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, password } = ctx.body as IUserCredentials;

  const user: NewUser = {
    password,
    name,
    companies: [],
  };

  const newUser = await authService.signUp(user);

  created(ctx as Context, newUser);

  log.info(`signUp: user '${name}' is successfully signed up`);
};

/**
 * Вход пользователя
 * */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  await authService.authenticate(ctx as Context, next);

  const user = ctx.state.user as IUser;

  ok(ctx as Context, user);

  log.info(`logIn: user '${user.id}' is successfully logged in`);
};

/**
 * Проверка текущего пользователя в сессии koa
 * */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  const { user } = ctx.state;

  delete user.password;

  ok(ctx as Context, user);

  log.info(`getCurrentUser: user '${ctx.state.user.name}' authenticated`);
};

const logOut = async (ctx: Context): Promise<void> => {
  const user = ctx.state.user as IUser;
  console.log('user', user);

  await authService.logout(user.id);

  console.log('user1', user);

  ctx.logout();

  ok(ctx as Context);

  log.info(`logOut: user '${user.name}' successfully logged out`);
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code, uid }: { code: string; uid?: string } = ctx.body;

  const deviceUid = await authService.verifyCode({ code, uid });

  ok(ctx as Context, deviceUid);

  log.info('verifyCode: ok');
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.params;

  const code = await deviceService.genActivationCode(deviceId);

  ok(ctx as Context, code);

  log.info('getActivationCode: activation code generated successfully');
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
