import Router from 'koa-router';
import Auth from './auth.router';
import Company from './company.router';
import Device from './device.router';
import User from './user.router';
import Message from './message.router';
import Test from './test.router';

const rootRouter = new Router({ prefix: '/api' });

for (const route of [Auth, Company, Device, User, Message, Test]) {
  rootRouter.use(route.routes());
}

export default rootRouter;
