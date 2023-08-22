import { ParameterizedContext, Next, Context } from 'koa';

import { IUser, IUserCredentials, NewAccessCode, NewActivationCode } from '@lib/types';

import { authService } from '../services';
import { created, ok } from '../utils/apiHelpers';

/**
 * Регистрация нового пользователя (Администратора компании)
 * */
export const signup = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { name, password, email } = ctx.request.body as IUserCredentials;

  authService.signup({
    password,
    name,
    email,
  });

  created(ctx as Context, undefined, `signup: user '${name}' is successfully signed up`);
};

/**
 * Вход пользователя
 * */
export const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  await authService.authenticate(ctx as Context, next);
  const user = ctx.state.user as IUser;

  ok(ctx as Context, user, `logIn: user '${user.name}' (${user.id}) is successfully logged in`);
};

/**
 * Проверка текущего пользователя в сессии koa
 * */
export const getCurrentUser = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { user } = ctx.state;

  delete user.password;

  ok(ctx as Context, user, `getCurrentUser: user '${user.name}' (${user.id}) authenticated`);
};

export const logout = async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.state.user) {
    const user = ctx.state.user as IUser;

    authService.logout(user.id);

    ctx.logout();
    ctx.session = null;

    ok(ctx as Context, undefined, `logout: user '${user.name}' (${user.id}) successfully logged out`);
  } else {
    ok(ctx as Context, undefined, 'logout: the session was over');
  }
};

export const verifyCode = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { code } = ctx.request.body as NewActivationCode;

  const uid = authService.verifyCode(code);

  ok(ctx as Context, uid, `verifyCode device '${uid}': ok`);
};

export const getDeviceStatus = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { id: uid } = ctx.params;

  const deviceStatus = authService.getDeviceStatus(uid);

  ok(ctx as Context, deviceStatus, `getDeviceStatus device '${uid}': ok`);
};

export const checkAccessCode = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { code } = ctx.request.body as NewAccessCode;

  const uid = authService.checkAccessCode(ctx.state.user.creator.id, code);

  ok(ctx as Context, uid, 'checkAccessCode: ok');
};

export const getAccessCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { adminId } = ctx.params;

  const code = authService.genAccessCode(adminId);

  created(ctx as Context, code, 'getAccessCode: activation code generated successfully');
};
