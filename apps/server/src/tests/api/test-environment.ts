import fs from 'fs';

import { createServer, KoaApp } from '../../server';
import { IItemDatabase } from '../../utils/databaseMenu';

let app: KoaApp | null = null;

const testDb: IItemDatabase = {
  name: 'TEST_BASE',
  path: 'C:\\DB\\',
  port: 3649,
};

export async function initEnvironment(): Promise<void> {
  app = await createServer({ name: 'testServer', dbName: testDb.name, dbPath: testDb.path, port: testDb.port });
}

export async function cleanUp(): Promise<void> {
  const dir = `${testDb.path}\\.${testDb.name}`;
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}

export function getApp(): KoaApp {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
