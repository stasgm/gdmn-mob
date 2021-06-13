import Router from 'koa-router';

import Auth from './auth.router';
import Company from './company.router';
import Device from './device.router';
import User from './user.router';
import Message from './message.router';
import DeviceBinding from './devicebinding.router';

const rootRouter = new Router({ prefix: '/api' });

rootRouter
  .use(Auth.middleware())
  .use(Company.middleware())
  .use(Device.middleware())
  .use(User.middleware())
  .use(Message.middleware())
  .use(DeviceBinding.middleware());

export default rootRouter;
