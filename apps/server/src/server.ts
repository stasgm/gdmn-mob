/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import fs from 'fs';
import path from 'path';

import Koa, { Context, Next } from 'koa';
import cors from '@koa/cors';

import session from 'koa-session';
import passport from 'koa-passport';
import helmet from 'koa-helmet';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import bodyParser from 'koa-bodyparser';
import morganlogger from 'koa-morgan';

import serve from 'koa-static-server';
import historyApiFallback from 'koa2-connect-history-api-fallback';

import { IUser } from '@lib/types';

import koaConfig from '../config/koa';

import log from './utils/logger';

import { validateAuthCreds } from './services/authService';
import { errorHandler } from './middleware/errorHandler';
import { userService } from './services';
import router from './routes';
import { createDb, dbtype } from './services/dao/db';

interface IServer {
  name: string;
  port: number;
  dbName: string;
  dbPath: string;
}

export type KoaApp = Koa<Koa.DefaultState, Koa.DefaultContext>;
// export type KoaApp = Koa;

export async function createServer(server: IServer): Promise<KoaApp> {
  const app: KoaApp = new Koa();
  app.keys = ['super-secret-key-web1215'];

  app.context.db = await createDb(server.dbPath, server.dbName);
  app.context.port = server.port;
  app.context.name = server.name;

  const dbArr = await (app.context.db as dbtype).dbid.read();
  const dbid = dbArr.length === 1 ? dbArr[0].id : '';
  const Config = { ...koaConfig, key: koaConfig.key + dbid };

  //Каждый запрос содержит cookies, по которому passport опознаёт пользователя, и достаёт его данные из сессии.
  //passport сохраняет пользовательские данные

  passport.serializeUser((user: unknown, done) => {
    console.log('serializeUser', user);
    done(null, (user as IUser).id);
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //passport достаёт пользовательские данные из сессии
  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('deserializeUser', id);
      const user = await userService.findOne(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const strategy: IStrategyOptions = { usernameField: 'name' };

  passport.use(new LocalStrategy(strategy, validateAuthCreds));

  // Логи для Morgan
  const logPath = path.join(process.cwd(), '/logs/');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
  const accessLogStream: fs.WriteStream = fs.createWriteStream(path.join(logPath, 'access.log'), { flags: 'a' });

  //const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://example.com';

  app
    .use((ctx, next) => {
      console.log(ctx.querystring);
      return next();
    })
    .use(errorHandler)
    .use(helmet())
    .use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ['*'],
          styleSrc: ["'unsafe-inline'"],
          imgSrc: ['*', 'data:'],
        },
      }),
    )
    .use(morganlogger('combined', { stream: accessLogStream }))
    .use(session(Config, app))
    .use(passport.initialize())
    .use(passport.session())
    .use(
      bodyParser({
        formLimit: '10mb',
        jsonLimit: '20mb',
        textLimit: '10mb',
        enableTypes: ['json', 'form', 'text'],
      }),
    )
    .use(
      cors({
        credentials: true,
        // origin: 'http://localhost:8080',
      }),
    )
    .use(historyApiFallback({ index: '/admin/index.html' }))
    .use(serve({ rootDir: 'admin', rootPath: '/admin' }))
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
}

process.on('SIGINT', () => {
  console.log('Ctrl-C...');
  console.log('Finished all requests');
  process.exit(2);
});

export const startServer = (app: KoaApp) => {
  app.listen(app.context.port);

  log.info(`${app.context.name} is running on http://localhost:${app.context.port}`);
};
