import { createServer, KoaApp } from '../../server';
import { IItemDatabase } from '../../utils/databaseMenu';

let app: KoaApp | null = null;

const testDb: IItemDatabase = {
  name: 'TEST_BASE',
  path: 'C:\\Work\\_develop\\',
  port: 3649,
};

export async function initEnvironment(): Promise<void> {
  app = await createServer({ name: 'testServer', dbName: testDb.name, dbPath: testDb.path, port: testDb.port });
}

export function cleanUp(): void {
  //
}

export function getApp(): KoaApp {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
