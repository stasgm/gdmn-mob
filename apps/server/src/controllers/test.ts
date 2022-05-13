import { ParameterizedContext, Context } from 'koa';

import { ok } from '../utils/apiHelpers';

const testServerConnection = async (ctx: ParameterizedContext) => {
  console.log('test');
  ok(ctx as Context, undefined, 'test server connection');
};

export { testServerConnection };
