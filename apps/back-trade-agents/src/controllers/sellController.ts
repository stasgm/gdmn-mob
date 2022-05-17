import { NextFunction, Request, Response } from 'express';

import { selectRecordSet } from '../service/sellService';
import { selectQuery } from '../sqlQueries/selectSell';
import { IRecordObject, IQuerySellBill, ISellBill } from '../type';
import { paramsValidator } from '../validators/sellValidator';
import ApiErrorRet from '../exceptions/apiError';
import { ok, queryArray2SellBill } from '../util';

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  if (paramsValidator(req.query)) {
    try {
      const { dateBegin, dateEnd, outletId, goodId } = req.query as IRecordObject;
      const selectParams = [new Date(dateBegin), new Date(dateEnd), outletId, goodId];
      const RecordSetResult: IQuerySellBill[] | undefined = await selectRecordSet<IQuerySellBill>(
        selectQuery,
        selectParams,
      );
      const sellBills: ISellBill[] | undefined = queryArray2SellBill(RecordSetResult);
      return ok(res, JSON.parse(JSON.stringify(sellBills)));
    } catch (e) {
      next(e);
    }
  } else {
    next(ApiErrorRet.BadRequest('Неверно заданы параметры', 'Неверно заданы параметры'));
  }
};
