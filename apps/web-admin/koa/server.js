import { hostName } from '../src/utils/constants';

const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static-server');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');

const app = new Koa();

const router = new Router();
router.prefix('/api');

const ADMIN_CONTAINER_PORT = process.env.ADMIN_CONTAINER_PORT || 3000;

const env = Router();
env.prefix('/env');
env.get('/', (ctx) => {
  if (process.env.HOST === hostName) {
    ctx.body = {
      protocol: 'https://',
      host: hostName,
      port: process.env.HTTPS_PORT,
    };
    ctx.status = 200;
  } else {
    ctx.body = {
      protocol: 'http://',
      host: process.env.HOST || 'localhost',
      port: process.env.PORT,
    };
    ctx.status = 200;
  }
});

router.use(env.middleware());

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(historyApiFallback({ index: '/admin/index.html' }))
  .use(serve({ rootDir: 'admin', rootPath: '/admin' }));

const koaCallback = app.callback();

if (process.env.HOST === hostName) {
  /**
   * HTTPS сервер с платным сертификатом
   */
  try {
    const cert = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.crt'));
    const key = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.key'));

    const ca = fs
      .readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.ca-bundle'), {
        encoding: 'utf8',
      })
      .split('-----END CERTIFICATE-----\r\n')
      .map((cert) => cert + '-----END CERTIFICATE-----\r\n')
      .pop();

    if (!ca) {
      throw new Error('No CA file or file is invalid');
    }

    https
      .createServer({ cert, ca, key }, koaCallback)
      .listen(ADMIN_CONTAINER_PORT, () =>
        console.info(`>>> HTTPS admin server is running at https://localhost:${ADMIN_CONTAINER_PORT}`),
      );
  } catch (err) {
    console.warn('HTTPS admin server is not running. No SSL files');
  }
} else {
  const httpServer = http.createServer(koaCallback);
  httpServer.listen(ADMIN_CONTAINER_PORT, () =>
    console.info(`>>> HTTP admin server is running at http://localhost:${ADMIN_CONTAINER_PORT}`),
  );
}
