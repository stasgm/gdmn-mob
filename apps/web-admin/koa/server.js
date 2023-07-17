const http = require('http');

const Koa = require('koa');
const Router = require('koa-router');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static-server');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');

const app = new Koa();

const router = new Router();
router.prefix('/api');

const env = Router();
env.prefix('/env');
env.get('/', (ctx) => {
  const PORT = process.env.PORT;
  // const HTTPS_PORT = process.env.HTTPS_PORT;
  const HOST = process.env.HOST;
  const ADMIN_CONTAINER_PORT = process.env.ADMIN_CONTAINER_PORT;

  console.log('ADMIN_CONTAINER_PORT', ADMIN_CONTAINER_PORT);

  const serverConfig = {
    protocol: 'http://',
    server: HOST || 'localhost',
    port: PORT || 3652,
  };
  // : {
  //     protocol: "https://",
  //     server: "server.gdmn.app",
  //     port: HTTPS_PORT || 3655,
  //   };

  // if (PORT) {
  ctx.status = 201;
  ctx.body = serverConfig;
  // } else {
  //   res.status(404).json({ error: 'Variable not found' });
  // }
});

router.use(env.middleware());

app
  .use(helmet())
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ['*'],
        styleSrc: ["'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
        imgSrc: ['*', 'data:'],
      },
    }),
  )
  .use(
    bodyParser({
      formLimit: '10mb',
      jsonLimit: '150mb',
      textLimit: '10mb',
      enableTypes: ['application/json', 'text', 'json'],
    }),
  )
  .use(router.routes())
  .use(router.allowedMethods())
  .use(historyApiFallback({ index: '/admin/index.html' }))
  .use(serve({ rootDir: 'admin', rootPath: '/admin' }));

const koaCallback = app.callback();
const httpServer = http.createServer(koaCallback);

httpServer.listen(3000, 'localhost', () => console.info('>>> HTTP server is running at http://localhost:3000'));

/**
 * HTTPS сервер с платным сертификатом
 */

// try {
//   const cert = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.crt'));
//   const key = fs.readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.key'));

//   const ca = fs
//     .readFileSync(path.resolve(process.cwd(), 'ssl/gdmn.app.ca-bundle'), { encoding: 'utf8' })
//     .split('-----END CERTIFICATE-----\r\n')
//     .map((cert) => cert + '-----END CERTIFICATE-----\r\n')
//     .pop();

//   if (!ca) {
//     throw new Error('No CA file or file is invalid');
//   }

//   https
//     .createServer({ cert, ca, key }, koaCallback)
//     .listen(config.HTTPS_PORT, config.HOST, () =>
//       log.info(`>>> HTTPS server is running at https://${config.HOST}:${config.HTTPS_PORT}`),
//     );
// } catch (err) {
//   log.warn('HTTPS server is not running. No SSL files');
// }
// };
