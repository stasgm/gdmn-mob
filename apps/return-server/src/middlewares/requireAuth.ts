// Middleware для проверки пользователя
// Подставляем его в те запросы, где важна аутентификация
import { Response, NextFunction } from 'express';

import ApiErrorRet from '../exceptions/apiError';
export const requireAuth = async (req: any, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    next(ApiErrorRet.UnauthorizedError());
  }
};
