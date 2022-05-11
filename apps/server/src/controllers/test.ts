import { ParameterizedContext, Context } from 'koa';

import { ok } from '../utils/apiHelpers';

const testServerConnection = (ctx: ParameterizedContext) => ok(ctx as Context, undefined, 'test server connection');

export { testServerConnection };
