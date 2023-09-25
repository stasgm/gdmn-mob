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
const HOST = process.env.HOST || 'localhost';
const USE_HTTPS = process.env.USE_HTTPS !== 'true';

const env = Router();
env.prefix('/env');
env.get('/', (ctx) => {
  ctx.body = {
    protocol: USE_HTTPS ? 'https://' : 'http://',
    host: HOST,
    port: USE_HTTPS ? process.env.HTTPS_PORT : process.env.PORT,
  };
  ctx.status = 200;
});

router.use(env.middleware());

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(historyApiFallback({ index: '/admin/index.html' }))
  .use(serve({ rootDir: 'admin', rootPath: '/admin' }));

const koaCallback = app.callback();

if (USE_HTTPS) {
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
        console.info(`>>> HTTPS admin server is running at https://${HOST}:${ADMIN_CONTAINER_PORT}`),
      );
  } catch (err) {
    console.warn('HTTPS admin server is not running. No SSL files');
  }
} else {
  const httpServer = http.createServer(koaCallback);
  httpServer.listen(ADMIN_CONTAINER_PORT, () =>
    console.info(`>>> HTTP admin server is running at http://${HOST}:${ADMIN_CONTAINER_PORT}`),
  );
}
