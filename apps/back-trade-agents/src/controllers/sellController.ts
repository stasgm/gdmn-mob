import { NextFunction, Request, Response } from 'express';

import { selectRecordSet } from '../service/sellService';
import { selectQuery } from '../sqlQueries/selectSell';
import { IRecordObject } from '../type';
import { paramsValidator } from '../validators/sellValidator';
import ApiErrorRet from '../exceptions/apiError';
import { ok } from '../util';

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  if (paramsValidator(req.query)) {
    try {
      const { dateBegin, dateEnd, outletId, goodId } = req.query as IRecordObject;
      const selectParams = [new Date(dateBegin), new Date(dateEnd), outletId, goodId];
      const sellBills: IRecordObject[] | undefined = await selectRecordSet<IRecordObject>(selectQuery, selectParams);
      return ok(res, JSON.parse(JSON.stringify(sellBills)));
    } catch (e) {
      next(e);
    }
  } else {
    next(ApiErrorRet.BadRequest('Неверно заданы параметры', 'Неверно заданы параметры'));
  }
};
