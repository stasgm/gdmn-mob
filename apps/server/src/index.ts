import { createServer, KoaApp, startServer } from './server';
require('dotenv').config();

export interface IItemDatabase {
  name: string;
  path: string;
}

const defaultDatabase: IItemDatabase = {
  name: 'db',
  path: process.env.FILES_PATH || '',
};

const run = async (dbase?: IItemDatabase): Promise<KoaApp> => {
  const db: IItemDatabase = dbase ?? defaultDatabase;

  const app = await createServer({
    name: 'WS-Server',
    dbName: db.name,
    dbPath: db.path,
  });

  startServer(app);

  return app;
};

if (module.children) {
  run().catch((err) => {
    console.error('!!! SERVER DROPPED BY ERROR !!!');
    console.error(err instanceof Error || typeof err !== 'object' ? err : '!!! undefined error !!!');
    process.exit(1);
  });
}

export default run;
