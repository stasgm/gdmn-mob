import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import cors from '@koa/cors';

import session from 'koa-session';
import passport from 'koa-passport';
import helmet from 'koa-helmet';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import bodyParser from 'koa-bodyparser';
import morganlogger from 'koa-morgan';

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

interface IAppContext extends Koa.DefaultStateExtends {
  db: dbtype;
  port: number;
  name: string;
}

export type KoaApp = Koa<Koa.DefaultState, IAppContext>;

export async function createServer(server: IServer): Promise<KoaApp> {
  const app: KoaApp = new Koa();
  app.keys = ['super-secret-key-web1215'];

  app.context.db = createDb(server.dbPath, server.dbName);
  app.context.port = server.port;
  app.context.name = server.name;

  passport.serializeUser((user: unknown, done) => done(null, (user as IUser).id));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  passport.deserializeUser(async (id: string, done) => {
    try {
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

  app
    .use(helmet())
    .use(errorHandler)
    .use(morganlogger('combined', { stream: accessLogStream }))
    .use(session(koaConfig, app))
    .use(
      bodyParser({
        formLimit: '10mb',
        jsonLimit: '20mb',
        textLimit: '10mb',
        enableTypes: ['json', 'form', 'text'],
      }),
    )
    // .use(errorHandler)
    .use(passport.initialize())
    .use(passport.session())
    .use(
      cors({
        credentials: true,
        origin: 'http://localhost:8080',
      }),
    )
    // .use(koaCors({ credentials: true }))
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
}

export const startServer = (app: KoaApp) => {
  app.listen(app.context.port);

  log.info(`Server '${app.context.name}' is running on http://localhost:${app.context.port}`);
};
