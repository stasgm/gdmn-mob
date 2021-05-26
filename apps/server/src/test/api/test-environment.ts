import Koa from 'koa';

import run from '../../';

let app: Koa<Koa.DefaultState, Koa.DefaultContext> | null = null;

export async function initEnvironment(): Promise<void> {
  app = await run();
}

export function getApp(): Koa<Koa.DefaultState, Koa.DefaultContext> {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
