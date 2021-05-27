import { createServer, KoaApp } from '../../server';

let app: KoaApp | null = null;

const testDb = {
  name: 'TEST_BASE',
  database: 'C:\\DB',
  port: 3649,
};

export async function initEnvironment(): Promise<void> {
  app = await createServer({ name: 'testServer', dbName: testDb.name, dbPath: testDb.database, port: testDb.port });
}

export function getApp(): KoaApp {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
