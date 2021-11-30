import { Request, Response, NextFunction } from 'express';

import ApiErrorRet from '../exceptions/apiError';
import { errorMessage } from '../util';

export default (err: any, req: Request, res: Response, next: NextFunction): Response => {
  console.log(err);
  if (err instanceof ApiErrorRet) {
    return res.status(err.status).json({
      result: false,
      error: errorMessage(err.status, err.name),
    });
  }
  return res.status(500).json({
    result: false,
    error: '500: Непредвиденная ошибка',
  });
};
