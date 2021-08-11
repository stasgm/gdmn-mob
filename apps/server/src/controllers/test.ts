import { ParameterizedContext, Context } from 'koa';

import log from '../utils/logger';

import { ok } from '../utils/apiHelpers';

const testServerConnection = (ctx: ParameterizedContext) => {
  ok(ctx as Context);
  log.info('test server connection');
};

export { testServerConnection };
