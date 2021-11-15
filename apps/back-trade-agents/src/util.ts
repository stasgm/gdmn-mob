import crypto from 'crypto';

import { Response } from 'express';

import { IResponse } from './type';

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
  return crypto.randomBytes(30).toString('hex');
};

export { ok, errorMessage, generateAuthToken };
