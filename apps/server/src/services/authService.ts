import { Next, Context } from 'koa';

import koaPassport from 'koa-passport';
import { v1 as uuidv1 } from 'uuid';

import { VerifyFunction } from 'passport-local';

import bcrypt from 'bcrypt';

import { IUserDto } from '@lib/types';

import log from '../utils/logger';

import { devices, users, codes } from './dao/db';

import * as userService from './userService';

const authenticate = async (ctx: Context, next: Next): Promise<IUserDto | undefined> => {
  const { deviceId } = ctx.query;
  const { userName } = ctx.request.body;

  const user = await users.find((i) => i.userName.toUpperCase() === String(userName).toUpperCase());

  if (!user) {
    throw new Error('пользователь не найден');
  }

  const device = await devices.find((el) => el.uid === deviceId && el.userId === user.id);

  if (!device) {
    throw new Error('связанное с пользователем устройство не найдено');
  }

  if (device.state === 'BLOCKED') {
    throw new Error('устройство заблокировано');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return koaPassport.authenticate('local', async (err: Error, usr: IUserDto) => {
    if (err) {
      throw new Error(err.message);
    }

    if (!usr) {
      throw new Error('неверный пользователь или пароль');
    }

    await ctx.login(usr);

    return usr;
  })(ctx, next);
};

const signUp = async ({ user }: { user: Omit<IUserDto, 'role'> }) => {
  // Если в базе нет пользователей
  // добавляем пользователя gdmn
  const userCount = (await users.read()).length;

  if (!userCount) {
    // const gdmnUser = await users.insert({
    //   userName: 'gdmn',
    //   creatorId: user.userName,
    //   password: passwordHash,
    //   companies: [],
    // });
    // await devices.insert({ name: 'GDMN-WEB', uid: 'WEB', state: 'ACTIVE', userId: gdmnUser });

    const gdmnUserObj: IUserDto = {
      userName: 'gdmn',
      creatorId: user.userName,
      password: 'gdmn',
      companies: [],
      role: 'Admin',
    };

    const gdmnUser = await userService.addOne(gdmnUserObj);

    await devices.insert({
      name: 'GDMN-WEB',
      uid: 'WEB',
      state: 'ACTIVE',
      userId: gdmnUser,
    });
  }

  const userid = await userService.addOne({
    ...user,
    role: user.creatorId === user.userName ? 'Admin' : 'User',
  });

  if (user.creatorId === user.userName) {
    await devices.insert({
      name: 'WEB',
      uid: 'WEB',
      state: 'ACTIVE',
      userId: userid,
    });
  }

  // TODO: обработать поиск по передаваемой организации
  /* if (deviceId === 'WEB') {
    await devices.insert({ name: 'WEB', uid: 'WEB', state: 'ACTIVE', userId: userid });
  } */

  return userid;
};

const validateAuthCreds: VerifyFunction = async (userName: string, password: string, done) => {
  const user = await userService.findByName(userName);

  if (!user) done(null, false);

  if (await bcrypt.compare(password, user.password)) {
    done(null, user);
  } else {
    done(null, false);
  }
};

const verifyCode = async ({ code, uid }: { code: string; uid?: string }) => {
  const rec = await codes.find((i) => i.code === code);

  if (!rec) {
    throw new Error('код не найден');
  }

  const date: Date = new Date(rec.date);

  log.info(date);
  date.setDate(date.getDate() + 7);
  log.info(date);

  // const dateDiff = date.getDate() - new Date().getDate();

  const diffTime = Math.abs(date.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // await codes.delete(i => i.code === code);
    throw new Error('срок действия кода истёк');
  }

  // обновляем uid у устройства
  const deviceId = uid || uuidv1();
  const device = await devices.find(rec.deviceId);

  if (!device) {
    throw new Error('код не соответствует заданному устройству');
  }

  await devices.update({ ...device, uid: deviceId, state: 'ACTIVE' });

  // const newDeviceId = await devices.insert({ userId: rec.user, uid: deviceId, blocked: false });

  await codes.delete((i) => i.code === code);

  return deviceId;
};

export { authenticate, validateAuthCreds, signUp, verifyCode };
