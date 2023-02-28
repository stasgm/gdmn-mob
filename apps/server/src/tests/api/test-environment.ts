import fs from 'fs';

import { IItemDatabase } from '../..';

import { createServer, KoaApp } from '../../server';

let app: KoaApp | null = null;

const testDb: IItemDatabase = {
  name: 'TEST_BASE',
  path: 'C:\\DB\\',
};

export async function initEnvironment(): Promise<void> {
  app = await createServer({ name: 'testServer', dbName: testDb.name, dbPath: testDb.path });
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
