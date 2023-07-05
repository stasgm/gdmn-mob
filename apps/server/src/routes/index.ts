import Router from 'koa-router';

import Auth from './auth.router';
import Company from './company.router';
import Device from './device.router';
import User from './user.router';
import Message from './message.router';
import DeviceBinding from './devicebinding.router';
import ActivationCode from './activationCode.router';
import TestServer from './test.router';
import Process from './process.router';
import AppSystem from './appSystem.router';
import DeviceLog from './deviceLog.router';
import File from './file.router';
import ServerLog from './serverLog.router';

const rootRouter = new Router();

rootRouter.prefix('/api/:version');

rootRouter.param('version', (version, ctx, next) => {
  ctx.query.version = version;

  return next();
});

rootRouter
  .use(Auth.middleware())
  .use(Company.middleware())
  .use(Device.middleware())
  .use(User.middleware())
  .use(ActivationCode.middleware())
  .use(Message.middleware())
  .use(DeviceBinding.middleware())
  .use(TestServer.middleware())
  .use(Process.middleware())
  .use(AppSystem.middleware())
  .use(File.middleware())
  .use(DeviceLog.middleware())
  .use(ServerLog.middleware());

export default rootRouter;
