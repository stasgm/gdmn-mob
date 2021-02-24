import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IResponse, IUser, IUserProfile, IDeviceInfo } from '../../../common';
import { userService } from '../services';
import { hashPassword } from '../utils/crypt';

export const makeProfile = (user: IUser) => ({
  id: user.id,
  externalId: user.externalId,
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  companies: user.companies,
  creatorId: user.creatorId,
});

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const profile = await userService.findOne(userId);

    if (!profile) {
      ctx.throw(404, 'пользователь не найден');
    }

    const result: IResponse<IUserProfile> = { result: true, data: makeProfile(profile) };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUser: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const user = await userService.findAll();

    const result: IResponse<IUserProfile[]> = { result: true, data: user };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsers: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  const user = ctx.request.body as Partial<IUser>;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  if (!user) {
    ctx.throw(400, 'не указаны данные пользователя');
  }

  const oldUser = await userService.findOne(userId);

  // TODO Проверяем свойство 'companies' => Проверяем что организации существуют

  if (!oldUser) {
    ctx.throw(400, 'пользователь не найден');
  }

  let passwordHash: string | undefined = undefined;

  if (user.password) {
    passwordHash = await hashPassword(user.password);
  }

  //Удаляем поля, которые нелья менять
  delete user.creatorId;
  delete user.role;

  try {
    const id = await userService.updateOne({
      ...oldUser,
      ...user,
      id: userId,
      password: passwordHash ?? oldUser.password,
    });

    const result: IResponse<string> = { result: true, data: id };

    ctx.status = 200;
    ctx.body = result;

    log.info('updateUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  // TODO пользовате
  try {
    await userService.deleteOne(userId);

    const result: IResponse<void> = { result: true };

    ctx.status = 200;
    ctx.body = result; //TODO передавать только код 204 без body

    log.info('removeUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const deviceIfno = ((await userService.findDevices(userId)) as unknown) as IDeviceInfo[];

    const result: IResponse<IDeviceInfo[]> = { result: true, data: deviceIfno };

    ctx.status = 200;
    ctx.body = result;

    log.info('getDevicesByUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { getDevicesByUser, getUsers, getUser, removeUser, updateUser };
