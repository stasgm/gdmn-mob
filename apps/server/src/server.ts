import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import Koa from 'koa';
import cors from '@koa/cors';

import session from 'koa-session';
import passport from 'koa-passport';
import helmet from 'koa-helmet';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import bodyParser from 'koa-bodyparser';
import morganlogger from 'koa-morgan';

import serve from 'koa-static-server';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

import { IUser } from '@lib/types';

import koaConfig from '../config/koa';

import config from '../config';

import log from './utils/logger';

import { validateAuthCreds } from './services/authService';
import { errorHandler } from './middleware/errorHandler';
import { userService } from './services';
import router from './routes';
import { createDb } from './services/dao/db';
import { checkProcessList, loadProcessListFromDisk } from './services/processList';
import { MSEС_IN_MIN } from './utils/constants';

interface IServer {
  name: string;
  port: number;
  dbName: string;
  dbPath: string;
}

export type KoaApp = Koa<Koa.DefaultState, Koa.DefaultContext>;
let timerId: NodeJS.Timer;

export async function createServer(server: IServer): Promise<KoaApp> {
  const app: KoaApp = new Koa();
  app.keys = ['super-secret-key-web1215'];

  app.context.db = await createDb(server.dbPath, server.dbName);

  loadProcessListFromDisk();
  checkProcessList(true);

  timerId = setInterval(checkProcessList, config.PROCESS_CHECK_PERIOD_IN_MIN * MSEС_IN_MIN);

  const sessions = app.context.db.sessionId.data;
  const sessionId = sessions.length ? sessions[0].id : '';
  const Config = { ...koaConfig, key: `${koaConfig.key}-${sessionId}` };

  //Каждый запрос содержит cookies, по которому passport опознаёт пользователя, и достаёт его данные из сессии.
  //passport сохраняет пользовательские данные
  passport.serializeUser((user: unknown, done) => {
    log.info('serializeUser', user);
    done(null, (user as IUser).id);
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //passport достаёт пользовательские данные из сессии
  passport.deserializeUser((id: string, done) => {
    try {
      log.info('deserializeUser', id);
      const user = userService.findOne(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const strategy: IStrategyOptions = { usernameField: 'name' };

  passport.use(new LocalStrategy(strategy, validateAuthCreds));

  // Логи для Morgan
  const logPath = path.join(process.cwd(), config.LOG_PATH);
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }

  const accessLogStream: fs.WriteStream = fs.createWriteStream(config.LOG_ACCESS_PATH, { flags: 'a' });

  app
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
        jsonLimit: '150mb',
        textLimit: '10mb',
        enableTypes: ['application/json', 'text', 'json'],
      }),
    )
    .use(
      cors({
        credentials: true,
      }),
    )
    .use(router.routes())
    .use(historyApiFallback({ index: '/admin/index.html' }))
    .use(serve({ rootDir: 'admin', rootPath: '/admin' }))
    .use(router.allowedMethods());

  return app;
}

process.on('SIGINT', () => {
  console.log('Ctrl-C...');
  console.log('Finished all requests');
  clearInterval(timerId);
  process.exit(2);
});

export const startServer = (app: KoaApp) => {
  const koaCallback = app.callback();

  const httpServer = http.createServer(koaCallback);

  httpServer.listen(config.PORT, () => log.info(`>>> HTTP server is running at http://localhost:${config.PORT}`));

  /**
   * HTTPS сервер с платным сертификатом
   */

  const cert = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.crt'));
  const key = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.key'));

  const ca = fs
    .readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.ca-bundle'), { encoding: 'utf8' })
    .split('-----END CERTIFICATE-----\r\n')
    .map((cert) => cert + '-----END CERTIFICATE-----\r\n')
    .pop();

  if (!ca) {
    throw new Error('No CA file or file is invalid');
  }

  https.createServer({ cert, ca, key }, koaCallback).listen(config.HTTPS_PORT, () =>
    log.info(`>>> HTTPS server is running at
  http://localhost:${config.HTTPS_PORT}`),
  );
};
