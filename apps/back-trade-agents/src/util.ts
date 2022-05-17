import { randomBytes } from 'crypto';

import { Response } from 'express';

import { IResponse, IQuerySellBill, ISellBill } from './type';

const ok = <T>(res: Response, dto?: T) => {
  const resp: IResponse<T> = {
    result: true,
  };

  if (dto) {
    resp.data = dto;
  }

  res.statusMessage = 'success result';
  res.status(200);
  res.json(resp);
};

const errorMessage = (status: number, name: string): string => status + ': ' + name;

const generateAuthToken = () => {
  return randomBytes(30).toString('hex');
};

const queryArray2SellBill = (arr: IQuerySellBill[] | undefined): ISellBill[] | undefined => {
  if (!arr) return undefined;
  return arr.map((item) => ({
    number: item.NUMBER,
    contract: {
      id: item.CONTRACTKEY,
      name: item.CONTRACT,
    },
    depart: {
      id: item.DEPARTKEY,
      name: item.DEPARTNAME,
    },
    documentdate: item.DOCUMENTDATE,
    quantity: item.QUANTITY,
    price: item.PRICE,
  })) as ISellBill[];
};

export { ok, errorMessage, generateAuthToken, queryArray2SellBill };
