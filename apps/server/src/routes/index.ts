import Router from 'koa-router';

import Auth from './auth.router';
import Company from './company.router';
import Device from './device.router';
import User from './user.router';
import Message from './message.router';
import DeviceBinding from './devicebinding.router';
import ActivationCode from './activationCode.router';

const rootRouter = new Router({ prefix: '/api' });

//const rootRouter = new Router({ prefix: '/api/:v' });

// rootRouter.param('v', (version, ctx, next) => {
//   console.log('router_version', version);

//   ctx.query.version = version;

//   return next();
// });

rootRouter
  .use(Auth.middleware())
  .use(Company.middleware())
  .use(Device.middleware())
  .use(User.middleware())
  .use(ActivationCode.middleware())
  .use(Message.middleware())
  .use(DeviceBinding.middleware());

export default rootRouter;
