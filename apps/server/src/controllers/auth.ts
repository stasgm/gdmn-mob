import { ParameterizedContext, Next, Context } from 'koa';
import { IResponse, IUser } from '../../../common';
import log from '../utils/logger';
import { authService, deviceService } from '../services';

/** Вход пользователя */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { deviceId } = ctx.query;
  const { userName, password } = ctx.request.body;

  if (!userName) {
    ctx.throw(400, 'не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'не указан пароль');
  }

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    await authService.authenticate(ctx as Context, next);

    const user = ctx.state.user as IUser;

    const result: IResponse<string> = { result: true, data: user.id };

    ctx.status = 200;
    ctx.body = result;

    log.info(`logIn: user '${user.id}' is successfully logged in`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  const user = ctx.state.user;

  delete user.password;

  const res: IResponse<IUser> = { result: true, data: user };

  ctx.status = 200;
  ctx.body = res;

  log.info(`getCurrentUser: user '${ctx.state.user.userName}' authenticated`);
};

const logOut = (ctx: Context): void => {
  const user = ctx.state.user;

  ctx.logout();

  const res: IResponse = { result: true };

  ctx.status = 200;
  ctx.body = res;

  log.info(`logOut: user '${user.userName}' successfully logged out`);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.query;
  const { externalId, userName, password, firstName, lastName, phoneNumber, companies, creatorId } = ctx.request.body;

  if (!userName) {
    ctx.throw(400, 'не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'не указан пароль пользователя');
  }

  const user = {
    externalId,
    userName,
    password,
    firstName,
    lastName,
    phoneNumber,
    companies: companies || [],
    creatorId: creatorId || userName,
  } as IUser;

  try {
    const id = await authService.signUp({ user, deviceId });

    const result: IResponse<string> = { result: true, data: id };

    ctx.status = 200;
    ctx.body = result;

    log.info(`signUp: user '${userName}' is successfully signed up`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code, uid }: { code: string; uid?: string } = ctx.request.body;

  log.info(`uid: ${uid}`);
  log.info(`code: ${code}`);

  if (!code) {
    ctx.throw(400, 'не указан код');
  }

  try {
    const deviceUid = await authService.verifyCode({ code, uid });

    const result: IResponse<string> = { result: true, data: deviceUid };

    ctx.status = 200;
    ctx.body = result;

    log.info('verifyCode: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const code = await deviceService.genActivationCode(deviceId);
    const result: IResponse<string> = { result: true, data: code };

    ctx.status = 200;
    ctx.body = result;

    log.info('getActivationCode: ativation code generated successfully');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
