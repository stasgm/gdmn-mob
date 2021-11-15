import { Response, NextFunction } from 'express';

import { findOne } from '../service/neDB';
import { db } from '../users';
db.loadDatabase();

export default async (req: any, res: Response, next: NextFunction) => {
  // Получение значения из header
  const authToken = req.headers['authorization'];
  // Поиск пользователя из db по токену
  const item = await findOne(db, { authToken });
  // Сохраняем объект пользователя в свойство user,
  // чтобы в следующих запросах разрешить доступ этому пользователю
  req.user = item?.user;
  next();
};
