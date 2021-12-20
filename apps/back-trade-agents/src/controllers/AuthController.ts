import { NextFunction, Request, Response } from 'express';

import bcrypt from 'bcrypt';

import { db, users } from '../users';
import { insert, remove } from '../service/neDB';
import { generateAuthToken, ok } from '../util';
import ApiErrorRet from '../exceptions/apiError';

db.loadDatabase();

const checkRequireAuth = async (req: Request, res: Response) => {
  return ok(res);
};

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return username === u.name;
  });
  if (!user) {
    next(ApiErrorRet.DataNotFound('Неверное имя пользователя', 'Неверное имя пользователя'));
    return;
  }

  //const salt = bcrypt.genSaltSync(10);
  // шифруем пароль
  //const passwordToSave = bcrypt.hashSync(user.password, salt);
  // выводим результат
  //console.log('passwordToSave=', passwordToSave);

  //Сравним пришедший пароль с тем, который хранится у нас

  const hashedPassword = user.password;

  if (await bcrypt.compare(password, hashedPassword)) {
    //Сгенерируем новый токен
    const authToken = generateAuthToken();
    //Сохраним новый токен в bd для вошедшего пользователя
    await insert(db, { authToken, user });
    return ok(res, { access_token: authToken });
  } else {
    next(ApiErrorRet.UnauthorizedError('Неверный пароль', 'Неверный пароль'));
  }
};

const logoutController = async (req: Request, res: Response) => {
  const authToken = req.headers['authorization'];
  //Удаляем из db запись с текущем пользователем
  await remove(db, { authToken });
  // //Удаляем токен из Header
  // delete req.headers['Authorization'];
  return ok(res);
};

export { loginController, checkRequireAuth, logoutController };
