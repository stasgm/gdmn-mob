import session from 'koa-session';

// 7 days for session cookie lifetime
const SESSION_COOKIE_LIFETIME = 1000 * 60 * 60 * 24 * 7;

const config: Partial<session.opts> = {
  key: 'koa:sess1234' /** (string) cookie key (default is koa:sess) */,
  maxAge: SESSION_COOKIE_LIFETIME /** (number) maxAge in ms (default is 1 days) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  sameSite: 'lax' /** (string) lets require that a cookie shouldn't
    be sent with cross-origin requests (default undefined) */,
};

export default config;
