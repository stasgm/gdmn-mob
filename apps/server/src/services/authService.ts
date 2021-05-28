import { Next, Context } from 'koa';
import koaPassport from 'koa-passport';
import { v1 as uuidv1 } from 'uuid';
import { VerifyFunction } from 'passport-local';
import bcrypt from 'bcrypt';

import { IUser, NewUser } from '@lib/types';

import { DataNotFoundException, UnauthorizedException } from '../exceptions';

import * as userService from './userService';
import { getDb } from './dao/db';

const authenticate = async (ctx: Context, next: Next): Promise<IUser> => {
  const db = getDb();

  const { devices, users } = db;

  const { deviceId } = ctx.query;
  const { name }: { name: string } = ctx.request.body;

  const user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());

  if (!user) {
    throw new UnauthorizedException('неверные данные');
    // throw new DataNotFoundException('имя пользователя или пароль')
  }

  const device = await devices.find((el) => el.uid === deviceId && el.userId === user.id);

  if (!device) {
    throw new UnauthorizedException('Связанное с пользователем Устройство не найдено');
  }

  if (device.state === 'BLOCKED') {
    throw new UnauthorizedException('Устройство заблокировано');
  }

  return koaPassport.authenticate('local', async (err: Error, usr: IUser) => {
    if (err) {
      throw new UnauthorizedException(err.message);
    }

    //TODO посмотреть как обработать правильно
    if (!usr) {
      throw new UnauthorizedException('Неверные данные');
    }

    await ctx.login(usr);

    return usr;
  })(ctx, next);
};

const signUp = async (user: NewUser): Promise<IUser> => {
  // Если в базе нет пользователей
  // добавляем пользователя gdmn
  const db = getDb();

  const { devices, users } = db;

  const userCount = (await users.read()).length;

  if (!userCount) {
    // TODO временно!!! в дальнейшем пользователя внешней системы тоже надо создавать
    const gdmnUserObj: Omit<IUser, 'id'> & { password: string } = {
      name: 'gdmn',
      creator: {
        id: '',
        name: '',
      },
      password: 'gdmn',
      companies: [],
      role: 'Admin',
    };

    const gdmnUser = await userService.addOne(gdmnUserObj);

    await devices.insert({
      id: '',
      name: 'GDMN-WEB',
      uid: 'WEB',
      state: 'ACTIVE',
      userId: gdmnUser.id,
    });
  }

  const newUser = await userService.addOne(user);

  if (!user.creator?.id) {
    // TODO временно!!! если создаётся не пользователем то добавляем устройство WEB
    await devices.insert({
      id: '',
      name: 'WEB',
      uid: 'WEB',
      state: 'ACTIVE',
      userId: newUser.id,
    });
  }

  return newUser;
};

const validateAuthCreds: VerifyFunction = async (name: string, password: string, done) => {
  const user = await userService.findByName(name);

  if (!user) {
    return done(new Error('неверные данные'));
  }

  const hashedPassword = await userService.getUserPassword(user.id);

  if (!hashedPassword) {
    throw new UnauthorizedException('неверные данные');
    // throw new DataNotFoundException('имя пользователя или пароль')
  }

  if (await bcrypt.compare(password, hashedPassword)) {
    done(null, user);
  } else {
    done(new Error('неверные данные')); //TODO возвращать ошибку вместо null
  }
};

const verifyCode = async ({ code, uid }: { code: string; uid?: string }) => {
  const db = getDb();
  const { devices, codes } = db;

  const rec = await codes.find((i) => i.code === code);

  if (!rec) {
    throw new DataNotFoundException('Код не найден');
  }

  const date: Date = new Date(rec.date);

  date.setDate(date.getDate() + 7);

  // const dateDiff = date.getDate() - new Date().getDate();

  const diffTime = Math.abs(date.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // await codes.delete(i => i.code === code);
    throw new UnauthorizedException('Срок действия кода истёк');
  }

  // обновляем uid у устройства
  const deviceId = uid || uuidv1();
  const device = await devices.find(rec.deviceId);

  if (!device) {
    throw new DataNotFoundException('Код не соответствует заданному устройству');
  }

  await devices.update({ ...device, uid: deviceId, state: 'ACTIVE' });

  // const newDeviceId = await devices.insert({ userId: rec.user, uid: deviceId, blocked: false });

  await codes.delete((i) => i.code === code);

  return deviceId;
};

const logout = async (userId: string) => {
  console.log('logout', userId);
  // делаем что надо
};

export { authenticate, validateAuthCreds, signUp, verifyCode, logout };
