import { IResponse } from '@lib/types';
import { Context } from 'koa';

const ok = <T>(ctx: Context, dto?: T) => {
  const resp: IResponse<T> = {
    result: true,
  };

  if (dto) {
    resp.data = dto;
  }

  ctx.statusMessage = 'success result';
  ctx.status = 200;
  ctx.body = resp;
};

const created = <T>(ctx: Context, dto?: T) => {
  const resp: IResponse<T> = {
    result: true,
  };

  if (dto) {
    resp.data = dto;
  }

  ctx.status = 201;
  ctx.body = resp;
};

const notOk = <T>(ctx: Context) => {
  const resp: IResponse<T> = {
    result: false,
  };

  ctx.status = 200;
  ctx.body = resp;
};

export { ok, created, notOk };
