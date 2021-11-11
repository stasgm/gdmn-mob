import { Request, Response } from 'express';

import bcrypt from 'bcrypt';

import { db, users } from '../neDBInit';
import { insert, remove } from '../service/neDB';
import { generateAuthToken } from '../util';

const checkRequireAuth = async (req: Request, res: Response) => {
  res.send({ success: true });
};

const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return username === u.name;
  });
  if (!user) {
    res.status(404).send({ success: false, error: { code: 404, message: 'Неверное имя пользователя' } });
    return;
  }
  const hashedPassword = user.password;
  //Сравним пришедший пароль с тем, который хранится у нас
  if (await bcrypt.compare(password, hashedPassword)) {
    //Сгенерируем новый токен
    const authToken = generateAuthToken();
    //Сохраним новый токен в bd для вошедшего пользователя
    await insert(db, { authToken, user });
    res.status(200).send({ success: true, data: { access_token: authToken } });
  } else {
    res.status(401).send({ success: false, error: { code: 401, message: 'Неверный пароль' } });
  }
};

const logoutController = async (req: Request, res: Response) => {
  const authToken = req.headers['authorization'];
  //Удаляем из db запись с текущем пользователем
  await remove(db, { authToken });
  // //Удаляем токен из Header
  // delete req.headers['Authorization'];
  res.status(200).send({ success: true });
};

export { loginController, checkRequireAuth, logoutController };
