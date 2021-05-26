import Koa from 'koa';

import { init } from '../../server';

let app: Koa<Koa.DefaultState, Koa.DefaultContext> | null = null;

const testDb = {
  name: 'TEST_BASE',
  database: 'C:\\Work\\_develop\\TEST_BASE',
  port: 3649,
};

export async function initEnvironment(): Promise<void> {
  app = await init(testDb);
}

export function getApp(): Koa<Koa.DefaultState, Koa.DefaultContext> {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
