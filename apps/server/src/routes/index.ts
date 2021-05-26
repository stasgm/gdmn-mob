import Router from 'koa-router';

import Auth from './auth.router';
import Company from './company.router';
import Device from './device.router';
import User from './user.router';
import Message from './message.router';

const rootRouter = new Router({ prefix: '/api' });

rootRouter
  .use(Auth.middleware())
  .use(Company.middleware())
  .use(Device.routes())
  .use(User.routes())
  .use(Message.routes());

export default rootRouter;
